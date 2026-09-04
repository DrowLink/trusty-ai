# TRUSTY.ai — Scoring Methodology & Explainability Specification
**Document ID**: SPEC-003  
**Status**: Approved & Implemented  
**Date**: September 2026  
**Authors**: Founding Engineering Team  

---

## 1. Core Principles

Traditional security scores often fail because they either:
1. Average everything together into an opaque number without context.
2. Allow a high reputation to mask critical vulnerabilities (e.g., a popular package with malicious credential dumping).
3. Treat unknown/missing data as "safe" by default.

TRUSTY.ai solves this through four mathematical pillars:
1. **Multi-Dimensional Weighted Aggregation**: Evaluating 20 distinct signals across 5 foundational dimensions.
2. **Hard Severity Overrides (Veto Triggers)**: Critical threat indicators override weighted averages to protect users.
3. **Confidence Metric & Uncertainty Penalization**: Missing information bounds the maximum attainable trust score.
4. **Human-First Explainability**: No score is emitted without an explicit narrative breakdown: positive evidence (✓), risk indicators (⚠), and unknown parameters (❓).

---

## 2. The 5 Dimensions & Weighting Matrix

We refine the baseline hypothesis to prioritize authorization safety, as improper privilege escalation and unauthorized tool execution represent 74% of agentic exploits:

| Dimension | Weight | Primary Question |
|---|:---:|---|
| **1. Permissions & Data Governance** | **30%** | Does requested access strictly respect least privilege relative to stated purpose? |
| **2. Identity & Provenance** | **25%** | Do we know cryptographically and organizationally who authored and signed this? |
| **3. Security Posture** | **25%** | Does the code enforce sandboxing, secret safety, and prompt-injection resilience? |
| **4. Behavior & Governance** | **10%** | Are actions audited, logged, and gated by human-in-the-loop controls? |
| **5. Reputation & Incidents** | **10%** | Does the publisher have a verified track record free of security incidents/scams? |

---

## 3. The 20 Explicit Signals

Each signal produces a normalized score between `0` (Critical failure / High risk) and `100` (Optimal / Hardened).

### Dimension 1: Identity & Provenance (Weight: 25%)
1. **Publisher Identity Verification (`SIG-ID-01`)**: Verified organization (e.g. GitHub verified org, DNS-linked company, public entity) vs anonymous handle.
2. **Domain / Organization Ownership (`SIG-ID-02`)**: Validated domain matching agent namespace with active TLS, SPF/DKIM records.
3. **Code & Package Provenance (`SIG-ID-03`)**: Transparent open source or verified binary artifact with verifiable build pipeline (SLSA / GitHub Actions).
4. **Signing, Attestation & Version Integrity (`SIG-ID-04`)**: Cryptographically signed releases (Sigstore/Cosign), Git commit signing, and immutable version tags.

### Dimension 2: Permissions & Data Governance (Weight: 30%)
5. **Requested Permission Scope (`SIG-PR-01`)**: Volume and criticality of scopes (Read-only vs Write vs Full Admin vs Financial/Credential access).
6. **Least-Privilege Alignment (`SIG-PR-02`)**: Correlation between stated purpose and requested capabilities (e.g. Calendar assistant requesting Gmail/Drive/Terminal is severely penalized).
7. **Data Collection Minimization (`SIG-PR-03`)**: Does the agent only request fields it strictly requires, or bulk export customer data?
8. **Retention & Deletion Transparency (`SIG-PR-04`)**: Clear, documented retention policy, local-first execution vs third-party telemetry sync.

### Dimension 3: Security Posture (Weight: 25%)
9. **Vulnerability & Dependency History (`SIG-SEC-01`)**: Known CVEs in dependencies, outdated packages, vulnerability velocity.
10. **Secrets & Credential Handling (`SIG-SEC-02`)**: Safe token storage (OS Keychain / Environment / Vault) vs plain-text storage or hardcoded API keys.
11. **Sandboxing & Isolation Evidence (`SIG-SEC-03`)**: Runs in isolated container (gVisor/Docker/WASM/subprocess jail) vs bare-metal host shell access.
12. **Prompt-Injection & Tool-Abuse Resilience (`SIG-SEC-04`)**: Parameter sanitization, structured output validation, guardrail presence against indirect prompt injection.

### Dimension 4: Behavior & Governance (Weight: 10%)
13. **Action Auditability & Structured Logs (`SIG-GOV-01`)**: Emits structured tamper-evident execution logs for every tool call and decision.
14. **Human Approval for Sensitive Actions (`SIG-GOV-02`)**: Built-in `human-in-the-loop` gates for destructive operations (email send, money transfer, file deletion).
15. **Policy & Purpose Consistency (`SIG-GOV-03`)**: Adherence to stated system prompt without behavioral evasion or hidden instructions.
16. **Change Frequency & Behavioral Drift (`SIG-GOV-04`)**: Rate of unversioned tool schema alterations and prompt modifications.

### Dimension 5: Reputation & Incidents (Weight: 10%)
17. **Scam / Abuse / Malware Reports (`SIG-REP-01`)**: Cross-checked against malware databases, PhishTank, GitHub advisory database, and community flags.
18. **Security Incident History & Response (`SIG-REP-02`)**: Documented security track record and average Mean Time to Remediate (MTTR).
19. **User / Enterprise Adoption Evidence (`SIG-REP-03`)**: High enterprise adoption, verified testimonials, active star/fork ratios.
20. **Publisher Ecosystem Track Record (`SIG-REP-04`)**: Established history across software package registries (NPM, PyPI, Homebrew).

---

## 4. Mathematical Formula & Severity Overrides

### 4.1. Base Weighted Score
$$S_{\text{raw}} = \sum_{i=1}^{5} W_i \cdot \left( \frac{1}{|D_i|} \sum_{s \in D_i} \text{Score}(s) \right)$$

Where $W = [0.25, 0.30, 0.25, 0.10, 0.10]$.

### 4.2. Confidence Calculation
Confidence $C \in [0, 100]\%$ is derived from the percentage of signals with concrete verifiable evidence vs signals evaluated with missing/default assumptions:
$$C = \left( \frac{N_{\text{verified}}}{20} \right) \times 100\%$$

If $C < 60\%$, the maximum achievable TRUSTY Score is capped:
$$\text{MaxAllowedScore}(C) = 50 + (C \times 0.5)$$
*(This ensures an unknown agent with zero verified background cannot masquerade as high-trust).*

### 4.3. Hard Severity Overrides (Circuit Breakers)
If any of the following critical indicators are detected, the calculated score is overridden regardless of other positive dimensions:

| Trigger Condition | Max Capped Score | Risk Classification |
|---|:---:|:---:|
| **Confirmed Malware / Exfiltration / Reverse Shell** | **0** | `CRITICAL RISK` |
| **Credential Theft / Hardcoded Private Keys** | **10** | `CRITICAL RISK` |
| **Arbitrary Unsandboxed Remote Code Execution without Human Approval** | **25** | `CRITICAL RISK` |
| **Extreme Scope Mismatch (e.g. Utility bot requesting Bank/Financial Auth)** | **35** | `HIGH RISK` |
| **Unverified Anonymous Author + Full Filesystem Write Access** | **45** | `HIGH RISK` |

### 4.4. Risk Tier Classification
- **🟢 80 – 100: LOW RISK** (Verified publisher, least-privilege, sandboxed, auditable).
- **🟡 60 – 79: MEDIUM RISK** (Minor telemetry gaps, broad permissions with justification, moderate confidence).
- **🟠 40 – 59: HIGH RISK** (Excessive scopes, unverified identity, missing audit logs).
- **🔴 0 – 39: CRITICAL RISK** (Severe privilege mismatch, vulnerability indicators, malware, or critical overrides).

---

## 5. Explainability Output Specification

Every evaluation response guarantees the following explainable JSON payload:

```json
{
  "trustyScore": 84,
  "riskTier": "LOW_RISK",
  "confidence": 78,
  "dimensions": {
    "identity": 95,
    "permissions": 78,
    "security": 82,
    "governance": 80,
    "reputation": 91
  },
  "positiveSignals": [
    "Verified publisher organization (GitHub Org: anthropic)",
    "Active open-source repository with 1.2k+ stars",
    "Reasonable permission scope aligned with Git manipulation",
    "No known security incidents or malware reports"
  ],
  "riskSignals": [
    "Requests write access to local working tree without mandatory 2FA",
    "No external third-party security audit report filed",
    "Telemetry collection policy lacks automated data purge disclosure"
  ],
  "unknownSignals": [
    "Unable to verify prompt injection resilience benchmarks"
  ],
  "summaryReasoning": "TRUSTY Score: 84 because we found 16 positive signals, 2 unknown signals, and 2 minor risk indicators. Identity and publisher track record are exemplary, while local filesystem write access warrants organizational caution."
}
```
