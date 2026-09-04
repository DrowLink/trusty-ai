# TRUSTY.ai — Continuous Monitoring & Drift Architecture Specification
**Document ID**: SPEC-004  
**Status**: Approved & Implemented  
**Date**: September 2026  
**Authors**: Founding Engineering Team  

---

## 1. The Core Threat: "A Trusted Agent Today Can Become Untrusted Tomorrow"

In traditional software security, code is static until a new version is released. In the agentic ecosystem:
1. An agent can update its tool schema dynamically or connect to new third-party endpoints.
2. System prompts and LLM weights can be altered upstream without warning.
3. Repositories can undergo ownership transfers or supply-chain compromises (e.g., dependency poisoning).
4. An agent initially asking only for read-only calendar access may introduce Gmail read/write permissions in a silent minor patch.

Therefore, **one-time evaluation is fundamentally inadequate**. TRUSTY.ai must continuously fingerprint, monitor, and re-evaluate agents.

---

## 2. Continuous Monitoring Lifecycle

```
[Agent Discovered]
       ↓
[Agent Fingerprint Created (SHA-256 Hashes)]
       ↓
[Initial Trust Signals Collected & Baseline Established]
       ↓
[Baseline TRUSTY Score Generated]
       ↓
[Continuous Monitor Daemon (Cron / Webhook / Event Stream)]
       ↓
[Change Detection (Diff in Tools, Permissions, Endpoints, Deps)]
       ↓
[Automated Re-Evaluation Triggered]
       ↓
[Score Delta Computed & Drift Alert Emitted]
```

---

## 3. The Cryptographic Agent Fingerprint

For every agent version, TRUSTY.ai computes an immutable fingerprint composite:

```typescript
export interface AgentFingerprint {
  fingerprintId: string; // sha256 of composite hashes
  timestamp: string;
  components: {
    manifestHash: string;      // Hash of normalized manifest JSON
    toolSchemasHash: string;   // Hash of ordered tool definitions & param schemas
    permissionsHash: string;   // Hash of requested OAuth / system permission scopes
    networkEndpointsHash: string; // Hash of outbound domains contacted
    dependenciesHash: string;  // Hash of resolved lockfiles (package-lock, poetry.lock)
  };
}
```

---

## 4. Drift Detection Heuristics

When the monitor detects a hash mismatch between the current state and the previous baseline, it categorizes the drift severity:

| Drift Event | Severity | Action Triggered |
|---|:---:|---|
| **New Permission Scope Added** (e.g. `+gmail:send`) | **CRITICAL** | Immediate score re-computation; quarantine recommendation emitted; notification sent to subscribing orgs. |
| **New Tool Endpoint / Outbound URL** (unrecognized IP/domain) | **CRITICAL** | Hard score penalty (-35); security alert raised. |
| **Publisher Identity Alteration** (transfer of ownership) | **HIGH** | Re-evaluation of identity dimension; requires manual re-attestation. |
| **Dependency Version Bump with High Severity CVE** | **HIGH** | Score penalty (-20); CVE details attached to risk profile. |
| **Minor Readme / Doc update** | **LOW** | Fingerprint refreshed; no score impact. |

---

## 5. Implementation Roadmap for Continuous Crawling
1. **Periodic Ingestion Cron**: Scheduled execution every 6 hours querying GitHub commits, MCP registry releases, and package updates.
2. **Webhook Ingestion**: MCP servers and agent registries post commit hooks to `/api/webhooks/agent-update`.
3. **Historical Score Graph**: Storing score timeseries data to render trust trajectory graphs (e.g., "Score dropped from 92 to 41 after release v1.4.0").
