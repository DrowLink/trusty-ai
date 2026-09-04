# Design System & Authority

<!-- impeccable:design-schema 1 -->

## Mode

Operate (Security intelligence dashboard, audit workbench, and leaderboard)

## Visual World: Institutional Security Terminal

An authoritative, razor-sharp dark surface designed for high-density threat inspection and risk evaluation.

### Colors & Semantic Palette
- **Canvas / Surface:** `#08090d` (pure dark obsidian, not saturated purple/blue).
- **Raised Panels:** `#0e1017` with hairline border `rgba(255, 255, 255, 0.08)`.
- **Text Primary:** `#f4f4f6` (high-contrast neutral).
- **Text Secondary / Muted:** `#8a8f9d` (tinted cool neutral, min 4.5:1 contrast).
- **Semantic Accents:**
  - `Verified / Low Risk:` `#10b981` (Emerald).
  - `Warning / Elevated Scope:` `#f59e0b` (Amber).
  - `Critical Threat / Override:` `#f43f5e` (Rose).
  - `Telemetry / Protocol:` `#38bdf8` (Sky).

### Typography
- **Headings & Body:** Clean system sans-serif with tight tracking (`-0.02em`), bold structure, clear scale steps.
- **Numbers & Data:** `font-mono tabular-nums` for all scores, counts, hashes, dates, and ratings.
- **Zero Eyebrows:** The heading carries its own weight without repetitive label badges above it.
- **Zero Unicode Emojis:** All iconography drawn from real SVG library (Lucide) in uniform 1.5px/2px stroke.

### Anti-Slop Enforcements
1. No gradient text.
2. No blurry decorative background orbs or random rainbow highlights.
3. No nested cards inside cards.
4. Elevation declared once via crisp hairline borders.
5. Custom styled caret, selection highlight, and scrollbars.
