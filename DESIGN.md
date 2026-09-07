# Design System & Authority — TRUSTY.bot™

<!-- impeccable:design-schema 1 -->

## Mode

Persuade & Operate (Institutional corporate fintech & autonomous AI agent clearinghouse)

## Visual World: Brex-Grade Corporate Fintech Authority

An ultra-clean, high-conviction aesthetic modeled after tier-1 enterprise financial institutions (Brex, Stripe, Moody's, VirusTotal). Characterized by generous whitespace, razor-sharp neo-grotesque typography, full-width edge-to-edge navigation with an announcement bar, de-cluttered layout surfaces, and high-contrast semantic indicators.

---

### 1. Palette & Surface Hierarchy

- **Canvas / Background:**
  - Light mode: Pure clean white (`#ffffff`) with hairline neutral dividers (`#e2e8f0` / `rgba(0, 0, 0, 0.08)`).
  - Dark mode: Obsidian midnight slate (`#070a11` / `#0a0d14`) with subtle borders (`rgba(255, 255, 255, 0.08)`).
  - *Elimination of AI slop:* No excessive rainbow gradients, no distracting multi-layered concentric circles, no oversized fuzzy blur blobs.
- **Top Header & Announcement:**
  - Announcement bar: High-contrast black (`#0a0d14` / `#000000`) with crisp white text and subtle interactive link.
  - Navigation header: Full-width edge-to-edge sticky bar with hairline bottom border (`border-b border-slate-200/80` dark: `border-white/[0.08]`) and translucent glass blur (`backdrop-blur-md`).
- **Brand Colors & Semantic Accents:**
  - `Electric Trust Blue:` `#0066ff` (Primary CTAs, active states, verified seals, focus rings).
  - `Fintech Obsidian:` `#080c14` (Headlines, top announcement bar, primary badges).
  - `Clearance Green:` `#10b981` / `#059669` (Autonomous approve verdicts, healthy credit limit).
  - `Intervention Amber:` `#f59e0b` / `#d97706` (Drift alert, unverified registry, limit warning).
  - `Circuit Breaker Rose:` `#f43f5e` / `#e11d48` (Host root exploits, malware, immediate revocation).
  - `M2M Sky:` `#0284c7` / `#38bdf8` (Sub-14ms telemetry packets, real-time clearing rails).

---

### 2. Navigation Architecture (Brex-Standard)

#### Desktop (>= 1024px)
- **Top Announcement Ribbon:** Crisp 32px bar highlighting product releases and live telemetry updates.
- **Main Full-Width Header:**
  - **Left:** TRUSTY.bot logo lockup (custom isotype + snug wordmark `TRUSTY.bot™` + `TRUST POWERS AGENTS`).
  - **Center:** Clear institutional navigation links:
    - Products / Agent Bureau
    - Decision Rail (`M2M` badge)
    - Underwriting (12 Day-0 + 20 Behavioral)
    - Economic Case
    - Pricing
  - **Right:** Quota monitor, `Sign in` link, Technical Specs trigger, Light/Dark mode toggle, and solid primary CTA button (`Audit Agent` in `#0066FF`, `rounded-lg`).

#### Mobile (< 1024px)
- **Header Layout:**
  - **Left:** Minimalist Hamburger menu button immediately adjacent to the `TRUSTY.bot™` logo.
  - **Right:** Compact primary CTA button (`Audit Agent`, `rounded-lg`).
- **Mobile Menu Drawer:**
  - Full-screen or slide-down drawer with clean typography, grouped by Platform and Institutional Solutions, plus direct sign-in and quota management.

---

### 3. Hero Layout & De-Saturation

- **Headline Hierarchy:**
  - Bold display headline (`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]`).
  - Clean, un-hyped explanatory subtitle with relaxed line height and neutral tone.
- **Integrated Action Input (Brex Email / Action Box Pattern):**
  - A unified input + button container (`border border-slate-300 rounded-xl bg-white p-1.5 focus-within:ring-2 focus-within:ring-[#0066FF]/20`).
  - Allows instant pasting of GitHub repos or agent names with direct `Audit Agent →` submission.
- **Secondary Demo Action:**
  - Direct video/interactive trigger: `▶ See live decision demo` with play icon, plus subtle monochrome quick samples.
- **Product Showcase Epicenter:**
  - The right column hosts the interactive `HeroDecisionPipeline` simulator framed as an authoritative terminal/card clearance device.
- **Partner Proof Marquee:**
  - Generously spaced corporate logos (Stripe, VISA, Brex, Coinbase, PayPal, Shopify, Anthropic, CrewAI) anchored by clean typography ("Trusted by fintechs & agent developers clearing autonomous transactions").

---

### 4. Typography Standard

- **Primary Sans:** High-performance `Inter` / `Plus Jakarta Sans` via `next/font/google`.
  - Negative tracking (`tracking-[-0.03em]`) on display headlines.
  - Crisp font weights (`font-black`, `font-bold`, `font-medium`).
- **Monospace Accents:** `JetBrains Mono` / system monospace for `tabular-nums`, audit latency (`<14ms`), hashes, and credit tier indicators.
