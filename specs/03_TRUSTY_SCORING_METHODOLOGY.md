# TRUSTY.ai — Scoring Methodology & Explainability Specification
**Document ID**: SPEC-003  
**Status**: Approved & Implemented  
**Date**: September 2026 (Updated to reflect Production MVP Implementation)  
**Authors**: Founding Engineering Team  

---

## 1. Core Principles & Philosophy

Traditional software vulnerability scanners fail in autonomous agentic environments because:
1. **Blind Arithmetic Averaging**: High stars and community downloads can easily mask a critical vulnerability (e.g., an unauthorized credential dumper in a popular open-source assistant).
2. **Missing Telemetry Treated as Safe**: Systems often default unverified data to "clean" or "safe", granting unearned trust.
3. **Black-Box Outputs**: Emitting a single opaque score without deterministic positive evidence and risk indicators prevents security teams from taking targeted remediation action.

TRUSTY.ai resolves this via four mathematical foundations:
1. **Multi-Dimensional Weighted Aggregation**: 20 distinct signals across 5 foundational dimensions.
2. **Hard Circuit-Breaker Overrides**: Critical threat triggers that immediately cap scores to critical risk tiers, bypassing averages.
3. **Confidence Metric & Uncertainty Clamping**: Penalizes missing information and mathematically bounds the maximum attainable trust score.
4. **Human-First Explainability Engine**: Emits deterministic human-readable rationales, positive evidence badges (✓), and concrete risk warnings (⚠).

---

## 2. The 5 Foundation Dimensions & Weighting Matrix

Authorization risks (scope over-privilege, terminal execution, and credential access) represent over 70% of agentic attack vectors. The weighting matrix reflects this threat reality:

| Dimension | Weight | Primary Security Question |
|---|:---:|---|
| **1. Permissions & Data Governance** | **30%** | Does requested access strictly conform to the principle of least privilege relative to stated category? |
| **2. Identity & Provenance** | **25%** | Can we verify cryptographically and organizationally who authored, signed, and maintains this agent? |
| **3. Security Posture** | **25%** | Does the code enforce sandboxing, secure credential storage, and prompt-injection resilience? |
| **4. Behavior & Governance** | **10%** | Are actions auditable, logged to immutable records, and gated by human approval for sensitive tasks? |
| **5. Reputation & Incidents** | **10%** | Does the publisher have an active, verified track record free of security incidents, CVEs, or malware flags? |

---

## 3. The 20 Concrete Evaluated Signals

Each signal produces a normalized score between `0` (Critical failure / High risk) and `100` (Optimal / Hardened).

### Dimension 1: Identity & Provenance (Weight: 25%)
1. **`SIG-ID-01` Publisher Identity Verification** (Weight: 0.35): Verified enterprise organization tied to DNS TXT record (Score: 98) vs individual developer (Score: 74) vs anonymous pseudonym (Score: 22).
2. **`SIG-ID-02` Domain & Organization Ownership** (Weight: 0.25): Validated DNS domain ownership matching agent namespace with active TLS (Score: 95) vs unverified domain (Score: 55) vs missing domain (Score: 25).
3. **`SIG-ID-03` Code & Package Provenance** (Weight: 0.25): Publicly auditable GitHub repository (Score: 92) vs published package registry artifact (Score: 75) vs closed-source unverified binary (Score: 30).
4. **`SIG-ID-04` Signing & Version Integrity** (Weight: 0.15): Cryptographically signed release tags and semantic release versioning (Score: 90) vs unversioned raw commits (Score: 40).

### Dimension 2: Permissions & Data Governance (Weight: 30%)
5. **`SIG-PR-01` Permission Scope Volume** (Weight: 0.30): Minimal focused scopes $\le 2$ (Score: 95) vs moderate scopes 3–5 (Score: 75) vs excessive scopes $>5$ (Score: 40).
6. **`SIG-PR-02` Least-Privilege Alignment** (Weight: 0.30): Evaluates scope proportionality against agent category. Disproportionate access (e.g. productivity bot requesting financial rails or root terminal) is severely penalized (Score: 15–30).
7. **`SIG-PR-03` Data Minimization & Privacy** (Weight: 0.20): Local-first execution or minimal field extraction (Score: 90) vs broad telemetry collection (Score: 50).
8. **`SIG-PR-04` Retention & Deletion Transparency** (Weight: 0.20): Explicit data retention policies and absence of persistent secret storage (Score: 85) vs undocumented persistence (Score: 45).

### Dimension 3: Security Posture (Weight: 25%)
9. **`SIG-SEC-01` Vulnerability & Dependency History** (Weight: 0.30): Zero known CVEs in dependency graph (Score: 95) vs active CVEs (Score: $\max(10, 80 - \text{cveCount} \times 25)$).
10. **`SIG-SEC-02` Secret & Credential Handling** (Weight: 0.30): Safe token passing via environment variables / KMS / Vault (Score: 95) vs risk of credential scraping or hardcoded tokens (Score: 10).
11. **`SIG-SEC-03` Sandboxing & Isolation Evidence** (Weight: 0.25): Runs in isolated microVM/container (Docker, WASM, gVisor) (Score: 90) vs bare-metal host shell access (Score: 25).
12. **`SIG-SEC-04` Prompt-Injection & Tool Guardrails** (Weight: 0.15): Integrated guardrail middleware (e.g. NeMo, Llama Guard, structured JSON validation) (Score: 90) vs unconstrained LLM output piping (Score: 40).

### Dimension 4: Behavior & Governance (Weight: 10%)
13. **`SIG-GOV-01` Action Auditability & Structured Logs** (Weight: 0.35): Emits structured tamper-evident execution logs for every tool call (Score: 92) vs ephemeral logging (Score: 35).
14. **`SIG-GOV-02` Human Approval Controls** (Weight: 0.35): Built-in human confirmation gates for sensitive/destructive operations (Score: 95) vs fully autonomous unconfirmed execution (Score: 40).
15. **`SIG-GOV-03` Policy & Purpose Consistency** (Weight: 0.15): Code capabilities match declared system prompt and purpose (Score: 90) vs latent undeclared capabilities (Score: 30).
16. **`SIG-GOV-04` Behavioral Stability & Drift** (Weight: 0.15): Low tool schema modification rate and stable dependency hashes (Score: 90) vs rapid unversioned drift (Score: 45).

### Dimension 5: Reputation & Incidents (Weight: 10%)
17. **`SIG-REP-01` Malware & Abuse Reports** (Weight: 0.35): Zero flags in threat intelligence feeds (VirusTotal, AlienVault OTX) (Score: 98) vs confirmed malicious flags (Score: 0).
18. **`SIG-REP-02` Security Incident Track Record** (Weight: 0.25): Clean historical operating record (Score: 95) vs documented security incidents (Score: 20).
19. **`SIG-REP-03` User & Community Adoption** (Weight: 0.20): High adoption (>1,000 stars, active forks) (Score: 92) vs moderate adoption (Score: 75) vs zero external adoption (Score: 45).
20. **`SIG-REP-04` Publisher Track Record** (Weight: 0.20): Established multi-package publisher in NPM, PyPI, or GitHub (Score: 90) vs new, zero-history entity (Score: 50).

---

## 4. Mathematical Formulations & Circuit Breakers

### 4.1. Base Weighted Score
$$S_{\text{raw}} = \sum_{k \in \text{Dimensions}} W_k \cdot \left( \frac{\sum_{s \in D_k} w_s \cdot \text{Score}(s)}{\sum_{s \in D_k} w_s} \right)$$

Where $W = [0.30, 0.25, 0.25, 0.10, 0.10]$.

### 4.2. Confidence & Missing Data Clamping
Confidence $C \in [0, 100]\%$ measures the proportion of signals with verified concrete evidence:
$$C = \left( \frac{N_{\text{verified}}}{20} \right) \times 100\%$$

If $C < 60\%$ (Minimum Confidence Threshold), an upper bound is placed on the final TRUSTY Score:
$$\text{MaxAllowedScore}(C) = 50 + (C \times 0.5)$$

*(Example: An agent with only 40% confidence can never receive a score higher than $50 + 20 = 70$, preventing unverified agents from being rated as low-risk).*

### 4.3. Hard Severity Overrides (Circuit Breakers)
If any critical risk condition triggers, the calculated score is clamped regardless of other positive dimensions:

| Trigger Code | Trigger Condition | Capped Max Score | Risk Tier Assigned |
|---|---|:---:|:---:|
| `OVERRIDE_MALWARE_CONFIRMED` | Confirmed malware, trojan, reverse shell, or malicious telemetry | **0** | `CRITICAL_RISK` |
| `OVERRIDE_CREDENTIAL_THEFT` | Requests local private keys, unencrypted secrets, or credential dumps | **10** | `CRITICAL_RISK` |
| `OVERRIDE_UNSANDBOXED_EXEC` | Bare-metal host shell execution without sandbox AND without human approval | **25** | `CRITICAL_RISK` |
| `OVERRIDE_UNSUPERVISED_TERMINAL` | Bare-metal host shell execution without human approval | **35** | `HIGH_RISK` |
| `OVERRIDE_DISPROPORTIONATE_SCOPE` | Productivity agent requesting financial payment rails or cloud root keys | **35** | `HIGH_RISK` |
| `OVERRIDE_ANONYMOUS_UNRESTRICTED_FS` | Anonymous/unverified author with unrestricted filesystem write access | **45** | `HIGH_RISK` |

### 4.4. Risk Tier Boundaries
- **🟢 LOW RISK (80 – 100)**: Verified identity, strict least-privilege, sandboxed execution, auditable logs.
- **🟡 MEDIUM RISK (60 – 79)**: Minor telemetry gaps, justified broad permissions, moderate confidence.
- **🟠 HIGH RISK (40 – 59)**: Unverified author, broad or excessive scopes, lack of human-in-the-loop controls.
- **🔴 CRITICAL RISK (0 – 39)**: Security compromise, credential exfiltration, or circuit-breaker override triggered.

---

## 5. Output Payload Schema (`TrustEvaluationResult`)

```typescript
export interface TrustEvaluationResult {
  agentId: string;
  agentName: string;
  trustyScore: number;          // Final normalized 0–100 score
  rawWeightedScore: number;     // Pre-override arithmetic score
  riskTier: RiskTier;           // LOW_RISK | MEDIUM_RISK | HIGH_RISK | CRITICAL_RISK
  confidence: number;           // 0–100%
  lastEvaluated: string;        // ISO 8601 timestamp
  dimensions: {
    identity: DimensionScore;
    permissions: DimensionScore;
    security: DimensionScore;
    governance: DimensionScore;
    reputation: DimensionScore;
  };
  overrideApplied?: CriticalOverride;
  positiveSignals: string[];
  riskSignals: string[];
  unknownSignals: string[];
  summaryReasoning: string;
}
```

---

## 6. Downstream Integration with the Credit Bureau (SPEC-005)
The TRUSTY Score serves as the foundational cybersecurity gate for financial underwriting:
- Any agent with a TRUSTY Score $< 30$ or an active security circuit-breaker is disqualified from financial clearing, receiving a Credit Tier of **SUBPRIME_D** with $0/day spending limit.
- Agents with a TRUSTY Score $\ge 80$ qualify for Prime and Super-Prime Autonomous Underwriting Tiers (**AAA / AA**).
