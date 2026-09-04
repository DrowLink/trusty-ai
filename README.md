# TRUSTY.ai — The Independent Trust & Reputation Layer for AI Agents

> **"VirusTotal + Moody's + credit bureau — but for AI agents."**

Before giving an AI agent access to your Gmail, Google Drive, Slack, Bank Accounts, CRM, or Company Infrastructure, there should be a simple, explainable answer to one question: **Can I trust this agent?**

This repository contains the production-grade MVP for **TRUSTY.ai**, built to solve two fundamental problems:
1. **Automatically discover AI agents** across open ecosystems without relying on static manual lists.
2. **Evaluate their trustworthiness** and generate an explainable **0–100 TRUSTY Score** with risk tiers, confidence ratings, and hard severity overrides.

---

## 🌟 Key Capabilities & Features

- **Multi-Source Discovery Engine**: Ingests agents dynamically from **3 public ecosystems**:
  - **GitHub Repositories**: Continuous crawling across topics (`ai-agent`, `mcp-server`, `crewai`, `langchain`) with manifest & tool extraction.
  - **Model Context Protocol (MCP) Registries**: Schema inspection of Anthropic MCP servers, tools, and permission requests.
  - **AI Agent Marketplaces**: Scanning registries like HuggingFace Spaces and CrewAI Hubs.
- **Explainable TRUSTY Scoring Core**:
  - Evaluates **20 concrete signals** grouped into **5 foundational dimensions**:
    - **Permissions & Data Governance (30%)** — Scope volume, category least-privilege alignment, data minimization.
    - **Identity & Provenance (25%)** — Verified organizational identity, domain ownership, code provenance, signing integrity.
    - **Security Posture (25%)** — Dependency CVE history, credential protection, sandboxing/isolation evidence, prompt-injection resilience.
    - **Behavior & Governance (10%)** — Action auditability, human-in-the-loop gates for destructive actions, drift tracking.
    - **Reputation & Incidents (10%)** — Scam/abuse reports, vulnerability disclosures, community adoption.
  - **Hard Severity Overrides**: Instant circuit breakers for confirmed malware, credential theft, or unsandboxed root shell access capping scores to 0–25 (Critical Risk).
  - **Confidence Metric**: Penalizes missing information so unknown agents cannot receive artificially high trust scores.
  - **Explainability First**: Every score provides human-readable positive signals (✓), risk warnings (⚠), and plain-English rationale.
- **Global Trust Leaderboard (Challenge Bonus Feature)**:
  - Real-time ranking with multi-variable filters: Category, Risk Level, Ecosystem, Permissions, and Sorting (Score, Confidence, Stars, Recency).
  - Quick consumer inquiries: *"What are the most trusted AI agents for managing my email?"* or *"Which AI agent should I trust with my financial information?"*.
- **Live Audit & Detonation Drawer**: Submit any agent manifest, GitHub repository, or test preset to inspect dynamic scores in real-time.
- **Continuous Monitoring & Cryptographic Fingerprinting**: Tracks manifest and tool schema hashes to detect behavioral drift.

---

## 📐 Formal Specifications Included

Comprehensive engineering specs are available in the [`/specs`](specs/) directory and accessible inside the web application:

1. [`specs/01_ARCHITECTURE_OVERVIEW.md`](specs/01_ARCHITECTURE_OVERVIEW.md): System architecture, layers, and data flow.
2. [`specs/02_DISCOVERY_ENGINE_SPEC.md`](specs/02_DISCOVERY_ENGINE_SPEC.md): Crawling adapters, rate-limiting, and canonical schema.
3. [`specs/03_TRUSTY_SCORING_METHODOLOGY.md`](specs/03_TRUSTY_SCORING_METHODOLOGY.md): Mathematical scoring formulation, 20 signals, confidence penalties, and overrides.
4. [`specs/04_CONTINUOUS_MONITORING_SPEC.md`](specs/04_CONTINUOUS_MONITORING_SPEC.md): Cryptographic agent fingerprinting and behavioral drift detection.
5. [`specs/TECHNICAL_MEMO.md`](specs/TECHNICAL_MEMO.md): 2-Page Executive Brief covering architecture, discovery, scoring, limitations, and future roadmap.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or later (tested on Node v24)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/trusty-ai-mvp.git
cd trusty-ai-mvp

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

This application is built with the **Next.js App Router** and is 100% ready for zero-config Vercel deployment.

```bash
# Using Vercel CLI
npx vercel

# Or push directly to your GitHub repository and link in the Vercel Dashboard
```

No external database or API keys are required for the base MVP.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (Strict typing)
- **UI & Styling**: React 18, Tailwind CSS, Lucide Icons, Glassmorphism design system
- **Deployment**: Vercel Serverless / Edge Runtime ready
# trusty-ai
