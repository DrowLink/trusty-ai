---
name: TRUSTY.bot marketing
description: Intent authorization expressed through a calm financial software identity.
colors:
  ink: "#172b29"
  muted: "#50625d"
  paper: "#f8f9f5"
  line: "#dce3db"
  accent: "#c5e86c"
  forest: "#203b32"
  sage: "#e9eddf"
  white: "#ffffff"
  review: "#fff4de"
  approved: "#eaf4e6"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(44px, 5.3vw, 78px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(34px, 3.5vw, 51px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    lineHeight: 1.7
  button:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
rounded:
  control: "7px"
  panel: "12px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "17px 25px"
---

# Design System: TRUSTY.bot

<!-- impeccable:design-schema 1 -->

## Overview

**Creative North Star: "Human intent, intact."**

The commercial surface uses cream paper, forest green and restrained sage panels to explain financial authorization clearly. Broad editorial sections alternate with concrete purchase evidence. The interface makes the instruction, proposed cart and decision legible together.

This refresh records the implementation in `src/app/(marketing)/marketing.css` and `src/components/marketing`. The existing application has a separate, denser light/dark identity defined in `src/app/globals.css`: neutral surfaces, blue actions and semantic risk colors. Preserve that distinction rather than applying the marketing palette globally.

**Key Characteristics:**

- Large, medium-weight display typography.
- Flat tonal sections and lightly bordered evidence panels.
- Interactive comparisons with explicit text outcomes.
- Responsive grids and a visible mobile navigation row.

## Colors

### Primary

Forest supplies dark section backgrounds; ink supplies headings, text and primary actions. The accent supports selection and small emphasis rather than filling every control.

### Secondary

Sage distinguishes explanatory provider diagrams and contact panels. Review and approved backgrounds identify example decision states with text and icons as well as color.

### Neutral

Paper is the marketing canvas. White holds purchase evidence. Muted text carries supporting explanations, and line separates content without heavy borders.

**The Surface Boundary Rule.** Marketing colors are scoped to the commercial wrapper; workspace light/dark tokens remain separate.

## Typography

Display and section headings use Outfit with a sans-serif fallback. Body text, navigation and controls use Plus Jakarta Sans with a sans-serif fallback. Both are loaded through `next/font/google` in the root layout.

The display and headline ramps are fluid. Section titles use 22px, weight 600; descriptive copy varies from 15px to 18px. Compact evidence rows are intentionally denser than editorial copy. Preserve readable mobile wrapping rather than forcing display text onto fixed lines.

## Layout

The main header, hero and standard sections share a 1440px maximum width and approximately 5% horizontal padding. The hero and major narrative sections use two columns; workflow steps use three columns. Broad section spacing is typically 80–110px on desktop.

At 1000px, column gaps and padding tighten. At 760px, major sections and workflow steps become single columns; navigation moves into its own full-width row, while sign-in and the primary action stay beside the brand. Mobile sections use approximately 60–65px vertical spacing and 6% horizontal padding. Contact content also becomes a single column.

## Elevation & Depth

Marketing uses flat tonal layering, thin borders and white inset evidence panels. It has no recurring shadow vocabulary. Primary buttons move upward by 1px on hover and change background over 0.2 seconds. Reduced-motion preferences disable transitions and animations within the marketing surface.

**The Evidence Frame Rule.** Group purchase evidence with borders and surface changes; keep the decision text part of the same visual unit.

## Shapes

Controls use gently rounded corners. Evidence and contact panels use the panel radius, with larger rounded outer frames around hero and provider illustrations. Repeated row dividers organize dense data; section layouts remain open rather than turning every paragraph into a card.

## Components

### Buttons and links

Primary actions use ink, white text and the control radius. The default minimum height is 48px; compact header buttons adapt on mobile. Text links keep a visible hover underline. Marketing focus uses a 3px green outline with a 5px offset. A keyboard-accessible skip link precedes navigation.

### Purchase review

The interactive review contains the human instruction, scenario buttons, proposed cart, criterion rows and a textual verdict. Selected scenario buttons use a sage tint and visible border with `aria-pressed`. The verdict is a polite live region. The expanded demo offers an example decision download and clearly labels the simulation.

### Provider flow

A centered diagram shows human intent, TRUSTY and one or multiple financial providers. Its buttons toggle the provider arrangement with a visible underline and `aria-pressed`. Platform names appear as text; the adjacent availability copy remains part of the component.

### Navigation

The commercial header links to product, integrations and design partners, plus sign-in and demo contact. The footer provides demo, pilot, application and integration-guide links. Mobile retains visible navigation rather than introducing an unimplemented drawer.

## Do's and Don'ts

- **Do** preserve the marketing/workspace style boundary.
- **Do** pair semantic color with explicit decision text and icons.
- **Do** keep provider availability and illustrative-demo labels readable.
- **Do** retain keyboard focus, skip navigation and reduced-motion behavior.
- **Don't** inherit the obsolete blue clearinghouse hero or partner-proof marquee from earlier documentation.
- **Don't** turn compact evidence labels into a general decorative eyebrow pattern.
- **Don't** add shadows merely to separate content already distinguished by surface and border.

