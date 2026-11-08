# Motion pass — doubleaa (dark site)

## Context
The dark, bold doubleaa is live (Next.js + framer-motion + Lenis). Aly wants it to *move* like
bluesqx.com — hover effects, smooth transitions, and "flying panels" (bluesqx's service cards
slide/stagger into place on scroll). Today the only motion is a single identical fade-up on every
section (`Reveal.tsx`) plus CSS hover lifts. That reads flat and repetitive — the opposite of the
premium, kinetic feel Aly is pointing at.

This is an `/impeccable animate` pass on the existing dark build. Inspiration only — our own
easing, timing, and behavior; no cloned bluesqx code. Mode: **Persuade** (motion may carry voice,
one rehearsed focal sequence over repeated reveals).

## Motion thesis (what makes this ours, not generic)
**"The machine runs."** doubleaa sells the website *and the automation behind it*. The focal
moment is the automation **flow diagrams coming alive**: when a flow tile enters view (and on
hover), a pulse of light travels node → arrow → node, so the pipeline literally *runs*. No
competitor can copy-paste that — it's tied to our n8n story. Everything else (flying panels,
hero, hover) is supporting motion in the same grammar: **pieces assembling into a working system.**

Single easing signature: `cubic-bezier(0.16, 1, 0.3, 1)` (confident ease-out). Exits faster than
entrances. Durations per the animate table (feedback 120–150ms, entrances 500–700ms focal).

## What changes, by surface (varied entrances — not one reveal everywhere)
1. **Hero (authored focal entrance, on load).** Headline reveals line-by-line via a clip-up mask
   (each line rises out of a clipped band, ~90ms apart), then lede → actions → proof strip fade-rise
   in sequence. One rehearsed sequence, ~700ms total. New client `Hero` component wraps the markup.
2. **Work bento — the "flying panels."** Tiles enter staggered within each grid: from a slight
   offset + scale (y:40px, scale:.96, opacity) settling with the ease-out, ~70ms stagger, total
   capped ~400ms. A faint per-tile delay by column gives the "flying into place" cascade. On hover:
   lift + accent border grow + title shifts to accent + an arrow glyph slides in from the right.
3. **Automation flow chips — the focal "run".** New client `FlowRun` component (rendered by the
   still-server `WorkTile`): nodes fade/scale in left-to-right; then an accent pulse travels the
   arrows (arrow `→` brightens in sequence, a small dot/glow runs the chain). Re-runs on tile hover.
   This is the signature moment.
4. **Capabilities — assemble, not fade.** The two panels enter from opposite sides (left panel from
   -x, right from +x) and meet — reads as "two halves of one build" (ties to the heading). Cap-list
   rows get a quick hover highlight (accent bullet grows, row text brightens).
5. **Studio statement — line reveal.** The big statement reveals by line/word with the clip-up mask
   (same device as hero, lighter), so it's not another box-fade.
6. **Nav — scroll state + magnetic CTA.** Bar condenses (tighter padding, stronger bg/elevation)
   after ~40px scroll. The "Start a project" CTA gets a subtle magnetic pull toward the cursor on
   hover (bounded ±6px) — a bluesqx-tier touch, cheap and reversible.
7. **Buttons / links (feedback).** Primary button: brightness + 1px press on active; ghost: border
   sweeps to accent. 120–150ms. Smooth-scroll anchor jumps already handled by Lenis.

## Implementation (reuse what exists; framer-motion is already installed)
- **Enhance `src/components/Reveal.tsx`**: add a `variant` prop (`rise` default, `panel`, `left`,
  `right`) and optional `index` for stagger delay; keep `useReducedMotion` guard + `once`.
- **New `src/components/Hero.tsx`** (client): the hero markup + the on-load clip-up headline
  sequence (framer-motion `variants` + `staggerChildren`). `page.tsx` renders `<Hero/>`.
- **New `src/components/FlowRun.tsx`** (client): renders the flow chips with in-view + hover pulse
  (framer-motion `useInView` + a replayable pulse; arrows animate via a traveling highlight).
  `WorkTile` (stays server) renders it in place of the current static `.flow`.
- **New `src/components/Stagger.tsx`** (client, thin): a motion container that staggers its Reveal
  children for the bento/caps grids — or fold into `Reveal` via a parent `StaggerGroup`. (Pick the
  smaller of the two at build time; likely one `Stagger` wrapper.)
- **`src/components/Nav.tsx`**: add a scroll listener (passive, rAF-throttled) toggling a
  `.bar.is-scrolled` class; add the magnetic CTA handler (pointermove on the button, reset on leave),
  both reduced-motion-guarded.
- **`src/app/page.tsx`**: swap in `Hero`, wrap grids in `Stagger`, pass `variant`/index to Reveals.
- **`src/app/globals.css`**: hover richness (tile arrow `::after`, border/title, cap-list rows,
  buttons), `.bar.is-scrolled`, flow-pulse keyframes/vars, clip-up mask utility, a single
  `--ease: cubic-bezier(0.16,1,0.3,1)` token. Compositor-only (transform/opacity/clip-path); scope
  `will-change` to active animations.

## Accessibility, performance, safety
- **Reduced motion**: every entrance/pulse/magnetic effect checks `prefers-reduced-motion`; the
  reduced path keeps content fully visible with only opacity/color feedback (no spatial movement,
  no pulse, no magnetic). framer-motion `useReducedMotion` + CSS `@media` both.
- **Content visible by default**: keep failed-JS risk low — reduced-motion and SSR render the
  resting (visible) state; no essential content gated behind an animation that could stick hidden.
- **Budget**: transform/opacity/clip-path only; no animating width/height/top/left. The flow pulse
  is a tiny bounded element; offscreen tiles don't run it (in-view gated). Target smooth on mobile.
- **One grammar**: all motion shares the single ease + "assembly" idea; no bounce/elastic, no
  scattered unrelated effects, not the same reveal on every section.

## Verification
- Build clean (`pnpm build`), `impeccable detect --json` → `[]`.
- Dev server + Chrome: watch hero load sequence; scroll and confirm tiles "fly" in staggered;
  hover a flow tile and confirm the pulse runs; hover tiles/buttons/cap-rows for feedback; confirm
  nav condenses on scroll and the CTA magnet feels subtle not jittery. Check dark **and** light.
- Toggle OS reduced-motion (or emulate) and confirm everything still appears, instantly, fully
  readable, with no movement — only color/opacity feedback.
- Mobile width: motion still smooth, nothing offscreen or janky.
- Then ship: commit, push, `vercel --prod` (publication steps need Aly's go, as before).
- Close the impeccable loop: finish-review + DESIGN.md once motion is accepted.

## Open / decisions
- Pushing motion to **bluesqx-pronounced** (Aly said "just like bluesqx"), kept tasteful and
  reduced-motion-safe — not dialed-back subtle.
- Magnetic CTA and flow-pulse are the two "signature" touches; easy to dial down if either feels
  like too much on review.
