# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Users:** Security engineers, developers, enterprise IT admins, and AI operators who need to decide whether to authorize an AI agent to access codebases, company inboxes, databases, and OAuth tokens.
- **Operating Context:** Evaluating newly discovered or third-party autonomous AI agents (MCP servers, LangChain/CrewAI agents) before installation or permission grant.

## Product Purpose

TRUSTY.ai provides an independent, explainable trust and reputation score (0–100) for AI agents across open ecosystems (GitHub, Model Context Protocol registries, and agent marketplaces), evaluating permission risk, identity provenance, security posture, governance, and historical incidents.

## Positioning

The "VirusTotal + Moody's + credit bureau" for autonomous AI agents. Unlike static lists or self-reported marketplace ratings, TRUSTY.ai executes continuous multi-source crawling and deterministic 20-signal scoring with hard circuit-breaker overrides for malware, credential theft, and unconstrained root execution.

## Capabilities and Constraints

- Continuous automated discovery from 3 distinct ecosystems: GitHub repos, NPM MCP registry, and Hugging Face Spaces.
- Deterministic 20-signal scoring across 5 weighted dimensions (Permissions 30%, Identity 25%, Security 25%, Governance 10%, Reputation 10%).
- Hard severity overrides: immediate score caps at 0–25 for confirmed malware, credential dumps, or unsandboxed root shell access.
- Live on-demand repository audit: users can input any public GitHub URL to inspect real-time security posture.
- Explainable audit output: plain-English rationale, verified positive evidence, and explicit material risk warnings.
- Bonus Trust Leaderboard with multi-factor filtering and sorting.

## Brand Commitments

- **Tone & Authority:** Serious, institutional, precise. Zero AI tropes, zero decorative fluff, zero childish gradients.
- **Visual Voice:** High-conviction security terminal (inspired by Moody's rating sheets, VirusTotal detection tables, and Linear's surgical precision).

## Product Principles

1. **Explainability over Black Boxes:** Every score must clearly state *why* it was awarded, with verifiable evidence.
2. **Missing Data is Not Safe:** Sparse telemetry penalizes confidence and caps maximum trust.
3. **Severe Threats Override Averages:** A single malicious exfiltration vector drops an agent to 0 / 100 regardless of positive metrics.
