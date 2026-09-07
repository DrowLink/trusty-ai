# TRUSTY.ai — Founding Technical Memo
**Deliverable**: 2-Page Executive & Technical Architecture Brief  
**Author**: Founding Senior Fullstack Engineer  
**Date**: September 2026 (Updated to reflect Production MVP Implementation)  
**Target**: TRUSTY.ai Founders, Technical Advisory Board & Investors  

---

## 1. System Architecture & Core Thesis

The agentic revolution is shifting rapidly from informational assistance to autonomous economic execution. AI agents are being delegated corporate credit cards (Brex, Ramp), bank accounts, cloud infrastructure, and OAuth scopes to procure goods, sign agreements, and orchestrate business operations. 

Yet, when an agent attempts to execute an action or spend capital, existing financial and security systems face two unanswered questions:
1. **"Can I trust this agent?"** (Cybersecurity & Governance Posture)
2. **"What is its safe financial limit?"** (Credit Bureau & Spending Envelopes)

TRUSTY.ai delivers the **first independent trust and credit underwriting layer for autonomous AI agents — combining the core functions of VirusTotal + Moody's + an Autonomous Credit Bureau**.

```
[Ingestion & Discovery: GitHub | MCP Registries | Marketplaces | Live AST Scanner]
                                      ↓
           [Normalization, Dependency Extraction & Cryptographic Fingerprinting]
                                      ↓
      ┌───────────────────────────────────────────────────────────────┐
      │                   Dual-Engine Intelligence Core               │
      │  1. 20-Signal Trust Evaluator (5 Dimensions + Circuit Overrides)│
      │  2. Agentic Credit Bureau (12 Day-0 Signals + 20 Behavioral)  │
      └───────────────────────────────────────────────────────────────┘
                                      ↓
[Real-Time M2M Decision Clearing Gateway (/api/decision: Visa | Stripe | Brex | Plaid)]
                                      ↓
         [Leaderboard UI, Dynamic SVG Badges & Developer REST APIs]
```

The system is deployed as a high-throughput, edge-deployable fullstack application (Next.js 14 App Router, React, TypeScript, Tailwind CSS) with zero required external paid API keys.

---

## 2. Ingestion, Crawling & Live AST Repository Scanning

Rather than relying on static directories, TRUSTY.ai ingests agents dynamically:
1. **GitHub Repositories & Manifests**: Queries repository topics (`ai-agent`, `mcp-server`, `crewai`, `langchain`, `autogen`), extracting stars, commits, licenses, and dependency lockfiles.
2. **Model Context Protocol (MCP) Registries**: Direct ingestion of open registries (Smithery, PulseMCP, NPM `@modelcontextprotocol`), parsing JSON-RPC tool signatures (`tools/list`, parameters, capabilities).
3. **Agent Marketplaces**: Hugging Face Spaces and CrewAI registries, cross-referencing natural language capability claims with actual integration scopes.
4. **Live Code AST Scanner (`POST /api/scan-repo`)**: Users can input any public GitHub URL to inspect source code AST patterns (`subprocess`, `os.system`, `eval`, `requests`, `boto3`, `stripe`), fetching raw files directly to bypass GitHub rate limits without downloading entire repositories.

---

## 3. Dual-Engine Intelligence Core

### 3.1. Deterministic Trust & Security Engine (0–100 Score)
Evaluates **20 concrete signals** across **5 weighted dimensions**:
- **Permissions & Data Governance (30%)**: Scope minimization, least-privilege alignment, data retention transparency.
- **Identity & Provenance (25%)**: Publisher verification, DNS ownership, package signing, source code provenance.
- **Security Posture (25%)**: Dependency CVEs, KMS/vault secret handling, microVM sandboxing, prompt-injection guardrails.
- **Behavior & Governance (10%)**: Structured tamper-evident audit logs, human approval gates for destructive writes.
- **Reputation & Incidents (10%)**: Absence of malware flags, security incident track record, enterprise adoption.

**Mathematical Circuit Breakers**: Bypasses weighted averages when existential threats are detected — confirmed malware caps scores at **0**, credential theft risks cap scores at **10**, and unsandboxed terminal execution caps scores at **25** (`CRITICAL_RISK`). Missing telemetry mathematically penalizes confidence ($C < 60\%$ bounds maximum allowable score).

### 3.2. Agentic Credit Bureau & Financial Underwriting (Tiers AAA to SUBPRIME_D)
- **12 Day-Zero Public Signals**: Evaluates cold-start agents before their first live transaction using verifiable public evidence (publisher identity, domain age, GitHub velocity, release history, CVEs, malware scans, code safeguards, and governance gates).
- **20 Behavioral Telemetry Signals**: For active agents (e.g. `ProcurementBot-847`), tracks live operating metrics: transactions attempted/completed, total AVUD (Agentic Volume Under Decision), decline rates, chargeback rates (<0.05% strict ceiling), human override rates, budget breach attempts, and counterparty outcomes.
- **Credit Tiers & Spending Envelopes**:
  - **AAA ($50k/day)**: Super-prime enterprise agent (Dual-custody, verified org, 180+ days clean telemetry).
  - **AA ($25k/day)**: Prime corporate agent (ProcurementBot-847, $4.1M+ AVUD, 0% chargebacks).
  - **A ($15k/day) / BBB ($5k/day) / BB ($1.5k/day) / B ($500/day)**: Calibrated operational tiers.
  - **SUBPRIME_D ($0/day)**: Blocked due to severe security compromise or trust score < 30.

---

## 4. Machine-to-Machine Clearing Gateway (`POST /api/decision`)

Acting as a sub-30ms clearing gate for payment rails (Visa, Stripe, Brex, Plaid), the decision engine evaluates financial requests against organizational policy envelopes:
- Enforces 5 automated policy gates: Cybersecurity Hard Gate $\rightarrow$ Amount Validation $\rightarrow$ Daily Velocity Capacity (AVUD) $\rightarrow$ Single-Transaction Autonomous Ceiling $\rightarrow$ Human Approval Enforcement.
- Returns deterministic clearing decisions: `APPROVED`, `DECLINED`, or `HUMAN_REVIEW` with structured audit trails.

---

## 5. Persistence, State & Badging Architecture

- **Hybrid Storage Layer (`src/lib/db/store.ts`)**: Primary persistence via Firebase Firestore with automatic in-memory fallback for zero-config deployments, paired with client-side `localStorage` caching (`clientStorage.ts`).
- **Cryptographic Drift Detection (`/api/agents/sync`)**: Computes SHA-256 composite hashes (Manifest + Tools + Permissions + Dependencies). Hash mismatches flag code drift and trigger automated score re-evaluations.
- **Dynamic SVG Trust Badges (`/api/badge/:slug`)**: Embeddable live badges showing real-time Trust and Credit scores for GitHub READMEs and marketplace profiles.
- **Usage & Quota Controller (`src/lib/quota.ts`)**: Multi-tier access management (Anonymous 10 evaluations, Community, and Enterprise API keys).

---

## 6. Technical Limitations & Future Engineering Roadmap

### Current MVP Limitations:
1. **Static AST vs Dynamic MicroVM Sandboxing**: The current AST inspection analyzes manifests and source files. Sophisticated adversaries might dynamically fetch payloads at runtime from unlisted IP addresses.
2. **Ecosystem Token Rate Limits**: Crawling hundreds of thousands of repositories requires enterprise token rotations and distributed proxy networks at scale.

### Product & Engineering Roadmap:
1. **Dynamic Sandboxed Execution ("Agent Detonation Chamber")**:
   - Spin up ephemeral Firecracker microVMs to execute agent tool calls against honeypot environments, monitoring outbound socket syscalls and prompt-injection resilience.
2. **TRUSTY Guard Interceptor SDK & MCP Reverse Proxy**:
   - A drop-in proxy for Claude Desktop, Cursor, and LangChain that intercepts tool calls at runtime, rejecting unauthorized terminal or financial executions.
3. **Continuous Webhook Daemons**:
   - Real-time Git push webhooks that immediately re-evaluate indexed agents, alerting connected enterprises within seconds if an update introduces behavioral drift.
