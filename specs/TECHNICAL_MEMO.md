# TRUSTY.ai — Founding Technical Memo
**Deliverable**: 2-Page Executive & Technical Brief  
**Author**: Founding Senior Fullstack Engineer  
**Date**: September 2026  
**Target**: TRUSTY.ai Founders & Investors  

---

## 1. System Architecture & Vision

Autonomous AI agents are accelerating toward ubiquity, acquiring privileged access to enterprise APIs, personal communication channels, credentials, and financial execution vectors. Yet, the foundational question remains unanswered at runtime: **"Can I trust this agent?"**

TRUSTY.ai delivers the first independent trust and reputation layer for the agentic web — analogous to **VirusTotal + Moody's + credit bureau for AI agents**.

```
[Discovery Crawlers: GitHub | MCP | Marketplaces]
                    ↓
   [Normalization & Canonical Agent Schema]
                    ↓
[Deterministic 20-Signal Engine + Severity Overrides]
                    ↓
 [Explainability Fabric & Cryptographic Fingerprints]
                    ↓
  [Trust Leaderboard & Real-Time Inspection API]
```

The system is architected as a high-throughput, edge-deployable fullstack application (Next.js App Router, React, TypeScript, TailwindCSS) designed for zero-friction deployment to Vercel and serverless architectures.

---

## 2. Discovery Methodology & Data Sources

Rather than relying on static, hand-curated directories, TRUSTY.ai ingests agents dynamically from **three primary public ecosystems**:

1. **GitHub Repositories & Manifests**:
   - Continuous scanning across repository topics (`ai-agent`, `mcp-server`, `crewai`, `langchain`, `autogen`).
   - Deep inspection of configuration manifests (`agent.json`, `tool-manifest.json`, `package.json`, `pyproject.toml`).
   - Extraction of code commit activity, contributor velocity, security workflows, and dependency lockfiles.

2. **Model Context Protocol (MCP) Registries & Hubs**:
   - Direct integration with open MCP registry indexes and tools (Smithery, PulseMCP).
   - Ingestion of JSON-RPC protocol declarations (`tools/list`, `resources/list`, argument schemas, and capability grants).

3. **AI Agent Marketplaces & Community Frameworks**:
   - Ingestion of public registries including Hugging Face Agent Spaces and CrewAI Tool Repositories.
   - Analysis of stated natural language capability descriptions against actual technical integrations (Slack, Gmail, Stripe, AWS, Databases).

---

## 3. Scoring Methodology & Explainability

A numerical score is useless if it is opaque. TRUSTY.ai models trust across **20 explicit signals** distributed across **5 weighted dimensions**:

1. **Permissions & Data Governance (30%)**: Evaluates permission scope, data minimization, and least-privilege alignment (e.g. flagging a calendar agent that requests Gmail inbox dump access).
2. **Identity & Provenance (25%)**: Publisher identity verification, domain DNS linkage, package signing, and source code provenance.
3. **Security Posture (25%)**: Dependency vulnerability history, secret handling, sandboxing evidence (gVisor, Docker, WASM), and prompt-injection resilience.
4. **Behavior & Governance (10%)**: Structured audit logging, human-in-the-loop gates for destructive tasks, and policy adherence.
5. **Reputation & Incidents (10%)**: Absence of scam reports, malware signatures, CVE response history, and ecosystem track record.

### Mathematical Innovations:
- **Hard Severity Overrides (Circuit Breakers)**: Indicators such as confirmed credential exfiltration or unsandboxed remote code execution immediately cap the score to **0–25 (Critical Risk)**, bypassing averages.
- **Confidence Metric & Uncertainty Penalty**: Agents with missing or untestable evidence receive a lower confidence rating, which mathematically restricts their maximum attainable trust score.
- **Human-First Explainability Engine**: Every score produces a synthesized rationale detailing exact verified positives (✓), risk warnings (⚠), and missing data flags (❓).

---

## 4. Biggest Technical Limitations (Current MVP)

1. **Static Analysis vs Runtime Sandboxing**: The current MVP performs static manifest analysis, code inspection, and ecosystem telemetry. While highly accurate for declared scopes, dynamic adversarial agents might obfuscate runtime payloads until triggered.
2. **Rate Limits & Authenticated Ecosystem Access**: High-frequency querying of GitHub search APIs and marketplace endpoints requires rotational proxy pools and enterprise token pools at planetary scale.
3. **Evolving Agent Standards**: Because formats vary (MCP JSON-RPC vs CrewAI YAML vs LangChain tools), continuous maintenance of ingestion parsers is required until universal agent manifest standards (e.g. IEEE/W3C agent standards) crystallize.

---

## 5. What We Would Build Next (Product Roadmap)

1. **Dynamic Sandboxed Execution Engine ("Agent Detonation Chamber")**:
   - Spin up ephemeral microVMs (Firecracker / gVisor) to run the agent against honey-tokens and synthetic environments, monitoring real-time outbound HTTP requests, syscalls, and prompt-injection resistance.
2. **TRUSTY Guard Interceptor SDK & MCP Proxy**:
   - A drop-in reverse proxy for MCP clients (Claude Desktop, Cursor, LangChain) that intercepts tool calls at runtime: *“TRUSTY.ai blocked this tool call: agent attempted to access /etc/shadow or send email without user approval.”*
3. **Continuous Cryptographic Drift Daemon**:
   - Automated continuous webhook ingestion that re-evaluates indexed agents on every Git push or schema change, immediately notifying connected enterprises if a trusted agent turns rogue.
4. **Enterprise Trust Policies**:
   - Enable CISOs to set custom compliance rules: *“Only allow agents with TRUSTY Score >= 85 and verified corporate identity.”*
