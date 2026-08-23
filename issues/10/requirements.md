# Requirements: issue-10

## Original ask
### Problem

UI looks kind of off and not very interactive, it feels kind of dull.

### Proposed solution

Add some animations and simplify UI for better UX.

### Acceptance criteria

- [ ] Animations are added
- [ ] UX is simplified everything looks smooth.


## Clarifications
| # | Question | Answer | Recommended |
|---|----------|--------|-------------|
| 1 | Where should this pass land: (a) system-wide tokens + baseline micro-interactions across all presentational components, (b) narrow to `ChatDemo` only, or (c) both, phased? | (a) System-wide: add transition/animation tokens to Nocturne and apply baseline micro-interactions (hover/focus/press, entrance transitions) consistently across all presentational components. | (c) Both, phased — rejected in favor of (a) |
| 2 | Should animation stay CSS-only (new `--motion-*`/`--ease-*` tokens, plain `transition`/`@keyframes`), or pull in a JS animation library? | Use **Framer Motion**. | CSS-only — rejected in favor of Framer Motion |
| 3 | What should "simplify UI for better UX" concretely mean: (a) visual-only tightening via existing tokens, (b) prop/API consolidation too, or (c) out of scope, treated as accomplished by the animation pass itself? | (c) Out of scope as a separate workstream — the animation pass itself is treated as satisfying "simplify UI for better UX." | (a) Visual-only tightening — rejected in favor of (c) |
| 4 | Should animations respect `prefers-reduced-motion`? | Yes. | Yes — accepted |
| 5 | How should Framer Motion animations be tested, given jsdom doesn't run real animation/layout: (a) assert on motion props/variants + reduced-motion swap, or (b) no automated tests, manual Storybook verification only? | (b) No automated tests for the animation layer; verify manually via Storybook, same precedent as issue #5 round 7's "pixel-perfect" verification. | (a) Assert motion props — rejected in favor of (b) |
| 6 | Which micro-interactions ship in this baseline pass? | All of the recommended set: `Button`/clickable `Card` hover-focus-press; entrance/exit for `Lightbox`, `ImagePreview`, `ArtifactPanel`; `ChatDemo` message entrance + smoother streaming/typing indicator; new `--motion-duration-*`/`--motion-ease-*` tokens backing all of it. Everything else (Chart, JsonViewer, CodeBlock, etc.) out of scope. | Accepted as proposed |

## Acceptance criteria
- [ ] New `--motion-duration-*` / `--motion-ease-*` tokens added to `tokens.css` (Nocturne), used as the source of all durations/easings below
- [ ] Framer Motion added as a runtime dependency
- [ ] `Button` (all variants) and clickable `Card` have hover/focus/press transitions
- [ ] `Lightbox`, `ImagePreview`, and `ArtifactPanel` animate in/out on mount/unmount (open/close)
- [ ] `ChatDemo`: new messages animate in on arrival; the simulated streaming/typing indicator gets a smoother animated treatment
- [ ] All of the above respect `prefers-reduced-motion: reduce` (durations collapse to near-zero)
- [ ] No automated tests added for the animation layer itself; existing non-animation component tests remain green; verified manually via Storybook
- [ ] Out of scope: Chart, JsonViewer, CodeBlock, and any component not listed above; no prop/API consolidation ("simplify" is satisfied by the animation pass itself, not a separate visual/API audit)

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
