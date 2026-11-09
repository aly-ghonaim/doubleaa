---
name: doubleaa
description: The website, and the machine that runs behind it — a field manual printed in two riso inks.
colors:
  paper: "#f2f1ec"
  paper-recessed: "#e9e8e1"
  card: "#fcfbf7"
  ink: "#17161c"
  ink-muted: "#5d5c5f"
  ink-faint: "#6a696b"
  hairline: "rgba(23, 22, 28, 0.15)"
  hairline-strong: "rgba(23, 22, 28, 0.30)"
  cobalt: "#2833c9"
  cobalt-ink: "#f3f2ea"
  cobalt-soft: "#dadae8"
  flame: "#ff5a1f"
  flame-ink: "#1a1005"
  flame-soft: "#f4dccf"
typography:
  display:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(2.6rem, 7vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(2rem, 4.6vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(1.45rem, 2.3vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.16em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.66rem"
    fontWeight: 400
rounded:
  tag: "3px"
  sm: "4px"
  lg: "8px"
  pill: "999px"
spacing:
  grid-gap: "16px"
  gutter: "24px"
  container: "1200px"
  section: "clamp(56px, 9vw, 116px)"
  card-pad: "24px 26px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.cobalt-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "13px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  nav-cta:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  status-ok:
    backgroundColor: "{colors.cobalt-soft}"
    textColor: "{colors.cobalt}"
    typography: "{typography.data}"
    rounded: "{rounded.tag}"
    padding: "4px 10px"
  status-pending:
    backgroundColor: "{colors.flame-soft}"
    textColor: "{colors.flame}"
    typography: "{typography.data}"
    rounded: "{rounded.tag}"
    padding: "4px 10px"
  flow-node:
    backgroundColor: "{colors.cobalt-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.tag}"
    padding: "4px 9px"
  author-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  machine-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "clamp(32px, 5vw, 60px)"
---

# Design System: doubleaa

## Overview

**Creative North Star: "The Field Manual"**

A page printed, not a screen lit. Cool bright paper carries near-black ink and two risograph inks, cobalt and fluoro-orange, each with one job. Structure comes from hairline ink rules and paper-on-paper cards; texture comes from a 1-bit halftone dot field and a faint offset-print grain multiplied over the whole page. The display face is a letterpress Caslon set large and roman; one word per heading is inked in flame italic.

Light is the single committed identity: there is no dark theme (`color-scheme: light`). The one dark surface is the machine plate, an ink-ground band where the automation schematic runs. Motion is a single ease signature, entrances clip upward out of their own line band, and the only looping motion is the flame pulse running the wires.

Density is editorial: generous section padding, a 1200px measure, a 16px grid gap, and prose capped near 42 to 62 characters.

**Key Characteristics:**
- Two inks, split by role: cobalt acts, flame emphasizes and pulses.
- Letterpress serif display at weight 400, never bold.
- Hairline rules (15% / 30% ink) instead of shadows at rest.
- Halftone dot field as the recurring signature, masked into corners.
- Low print radii (3px / 4px / 8px).
- One ease, `cubic-bezier(0.16, 1, 0.3, 1)`, for every state change.

## Colors

Paper and ink with two riso inks held to strict roles; no third hue exists.

### Primary
- **Riso Cobalt** (#2833c9): the action ink. Primary buttons, the nav CTA, the copy-email button, the focus ring, the "ok" status, project category labels, Q&A question labels, hovered tile titles, flow nodes and wires. Text on cobalt is **Cobalt Ink** (#f3f2ea).

### Secondary
- **Fluoro Flame** (#ff5a1f): the emphasis ink. The one marked word in each display heading, the wordmark italic, the print edge that wipes across a hovered tile, nav underlines, text selection, the "pending" status, and every pulse (flow run, machine wire). Text on flame is **Flame Ink** (#1a1005).

### Neutral
- **Cool Paper** (#f2f1ec): page ground and scrollbar track.
- **Recessed Paper** (#e9e8e1): recessed ground.
- **Card White** (#fcfbf7): raised card and panel surface.
- **Cool Ink** (#17161c): text, the machine plate, the ghost-button hover fill.
- **Muted Ink** (ink 68% into paper): secondary prose, ledes, blurbs.
- **Faint Ink** (ink 62% into paper): labels, footer metadata, tool stacks.
- **Hairline / Strong Hairline** (ink at 15% / 30%): dividers and card borders respectively.
- **Cobalt Soft / Flame Soft** (cobalt 12% / flame 14% into paper): tinted fills behind cobalt or flame status text and flow nodes.

### Named Rules
**The Two-Ink Rule.** Cobalt means "act here"; flame means "look here" or "this is moving". A cobalt surface is always clickable; flame never fills a button.

**The Mixed-From-Ink Rule.** Every secondary neutral and tint is a `color-mix` of ink, paper, cobalt or flame. Do not introduce a free-standing gray.

## Typography

**Display Font:** Libre Caslon Display (with Georgia, serif), weight 400 only
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), 400 / 500 / 600
**Label/Mono Font:** JetBrains Mono (with ui-monospace), 400 / 500

**Character:** A high-contrast letterpress roman over a plain, warm grotesk; the serif speaks, the grotesk explains, the mono only reports.

### Hierarchy
- **Display** (400, clamp(2.6rem, 7vw, 5.4rem), 1.02, -0.012em): the hero headline only, balanced, max 15ch, each line clipped and rising.
- **Headline** (400, clamp(2rem, 4.6vw, 3.4rem), 1.04): section titles; contact and machine titles and the studio lede sit in the same band (to 3.6rem), max 16 to 20ch.
- **Title** (400, clamp(1.45rem, 2.3vw, 2rem), 1.06): project tile titles and capability panel heads.
- **Body** (400, 17px, 1.6): prose; ledes at clamp(1.05rem, 1.6vw, 1.22rem) in muted ink, max 58 to 62ch.
- **Label** (600, 0.66 to 0.72rem, 0.1 to 0.18em tracking, uppercase, grotesk): row and group labels ("Built with", work groups), project categories, Q&A questions.
- **Data** (mono 400, 0.66 to 0.76rem): pipeline nodes, status chips, roles, stacks, footer contact and locale.

### Named Rules
**The Roman-Led Rule.** Display type is roman at weight 400. Italic appears only on the single flame-marked word (and the wordmark), never as a whole-heading treatment.

**The One Marked Word Rule.** A display heading carries at most one marked word, flame and italic.

**The Mono-Is-Data Rule.** JetBrains Mono sets only real system data: pipeline steps, statuses, stacks, roles, contact strings. Labels and prose stay in the grotesk.

## Layout

A centered 1200px container with a 24px gutter (respecting safe-area insets). Sections pad clamp(56px, 9vw, 116px) vertically; the hero pads clamp(64px, 11vw, 132px) on top. Grids share a 16px gap: a two-column capability pair, a six-column bento for work (featured span 4, narrow span 2, wide span 6, default span 3), and a three-column Q&A row. The machine plate splits 0.9fr / 1.1fr. Collapse points: bento to two columns at 860px and one at 540px; capabilities to one at 820px; Q&A and machine to one at 760px; nav links hide at 720px; the hero machine teaser hides below 1060px. Grid children carry `min-width: 0`.

## Elevation & Depth

Flat at rest. Depth is tonal (card white on paper, the ink plate) and drawn (hairline borders). Shadows appear only in response to state, always soft, ink-tinted, and pulled in by a negative spread.

### Shadow Vocabulary
- **Scrolled bar** (`box-shadow: 0 10px 28px -20px rgba(23, 22, 28, 0.5)`): the sticky top bar once the page scrolls.
- **Lifted tile** (`box-shadow: 0 18px 34px -26px rgba(23, 22, 28, 0.55)`): a hovered work tile, paired with a 4px lift.
- **Misregistration** (`text-shadow: -1px -1px 0` cobalt at 55%): only on the flame italic of the wordmark, a two-pass-print ghost.

### Named Rules
**The Flat-At-Rest Rule.** Nothing casts a shadow until it is scrolled under or hovered.

**The One Trick Rule.** Offset misregistration is the world's single print trick; it lives on the wordmark and nowhere else.

## Shapes

Crisp print geometry. Buttons and the nav CTA use 4px; cards, panels, the contact band and the machine plate use 8px; data tags (status, flow nodes) use 3px; the author chip and scrollbar thumb are full pills. Borders are 1px hairlines (1.5px on buttons, dashed cobalt on the open slot). Arrows are a single masked SVG stroke (2.4 weight, round caps) colored by `currentColor`. The halftone field is a 0.9px dot on a 5px grid (1px on 6px for large washes), masked by a radial or linear gradient into a corner.

## Components

### Buttons
- **Shape:** gently squared (4px), 1.5px border, 13px 22px padding, grotesk 600 at 0.96rem, optional trailing drawn arrow.
- **Primary:** cobalt fill, cobalt-ink text. Hover brightens (`brightness(1.08)`) and lifts 1px; active dims (`0.94`) and presses 1px at 80ms. The arrow nudges 3px right on hover.
- **Ghost:** transparent with a strong hairline border; hover inverts to an ink fill with paper text.
- **Focus:** 2px cobalt outline, 3px offset, everywhere.

### Chips
- **Status:** mono, uppercase, 0.06em tracking, 3px radius. Ok = cobalt text on cobalt soft; pending = flame text on flame soft; neutral = muted text on a hairline border. Labels stay honest (Built, Live client, Designed).
- **Author:** mono pill with a strong hairline border, the name in cobalt 600.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** card white on paper; the machine plate is ink.
- **Shadow Strategy:** flat at rest; see Elevation.
- **Border:** 1px strong hairline (dashed cobalt-tinted for the empty slot).
- **Internal Padding:** 24px 26px for tiles, clamp(26px, 3vw, 40px) for panels, 26px for Q&A.
- **Work tile hover:** lifts 4px, border tints toward cobalt, a 2.5px flame edge prints left to right across the top, the halftone shoulder darkens (0.14 to 0.24), and the title turns cobalt as its arrow slides in.

### Navigation
- Sticky boxed bar on 90% paper with a 6px blur and a bottom hairline; tightens its padding (15px to 9px) and gains the scrolled shadow on scroll. Caslon wordmark left, links in muted grotesk 0.82rem with a flame underline that scales in from the left, cobalt CTA right with a bounded magnetic pull (plus or minus 6px). Links hide under 720px.

### Flow Run (signature)
A tile's pipeline drawn as mono nodes on cobalt soft joined by drawn cobalt arrows. When it runs, a flame light sweeps through each node and each arrow swells flame in sequence, stepped 110ms per beat, and the last node gives a small 1.07 pop. Transform and opacity only.

### Machine Plate (signature)
The single ink-ground band: a cobalt halftone wash from the top right, a schematic of hairline paper-toned boxes and wires with mono labels, flame junction dots, and a flame dash that runs the wires on a 3.4s linear loop. Reduced motion freezes it to a static stroke.

### Halftone Shoulder (signature)
The dot field masked into a card corner at 0.14 to 0.22 opacity. Its ink alternates (cobalt on the first capability panel, flame on the second; flame on the contact band) so neighbors never repeat.

## Do's and Don'ts

### Do:
- **Do** give every clickable primary surface cobalt and every emphasis or motion flame (The Two-Ink Rule).
- **Do** set display type in Libre Caslon Display at 400, roman, with at most one flame italic word per heading.
- **Do** structure with 1px ink hairlines at 15% and 30%, and keep surfaces flat until hovered or scrolled under.
- **Do** time every state transition on `cubic-bezier(0.16, 1, 0.3, 1)`, with exits faster than entrances (130ms fast, 260ms medium); linear is reserved for constant-velocity loops like the machine pulse.
- **Do** honor reduced motion by dropping movement while keeping color and opacity feedback.
- **Do** draw icons as masked SVG strokes in `currentColor`.

### Don't:
- **Don't** add a third accent hue or a free-standing gray; derive tints from ink, paper, cobalt or flame.
- **Don't** add a dark theme; light paper is the identity, and the machine plate is the only ink ground.
- **Don't** bold the display face or set whole headings in italic.
- **Don't** put a tracked uppercase label above a heading as a kicker; labels name rows, groups and data, never introduce a title.
- **Don't** use unicode glyphs as icons or arrows.
- **Don't** use radii above 8px on surfaces, or soft app-style rounding.
- **Don't** use offset shadows anywhere but the wordmark's misregistration ghost.
- **Don't** set prose or labels in mono; mono is for real system data.
