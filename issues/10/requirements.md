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

## Acceptance criteria
- [ ] ...

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
