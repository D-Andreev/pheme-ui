# Review Report

**Fresh-eyes:** judgments based on artifacts and diff only (`main...HEAD` on `workflow/issue-10`).

## Verdict
APPROVE WITH NOTES

## Scenario verification

### Scenarios verified

| # | Scenario | Method | Result | Notes |
|---|----------|--------|--------|-------|
| 1 | Button hover/focus/press micro-interactions (all variants) | code trace | pass | `motion.button` with `whileHover`/`whileTap`/`whileFocus` scale, gated off when `disabled`; duration from `useMotionDurations()` |
| 2 | Card → Clickable opt-in via `onClick` (role, keyboard activation, inert when no `onClick`) | code trace | pass | `clickable = !!onClick` gates `role="button"`, `tabIndex`, keyboard handler, and motion together; existing `MessageBubble`/`WebSearchCard` usages don't pass `onClick`, so behavior is unchanged there |
| 3 | Lightbox / ArtifactPanel fade(+rise) in and out | code trace | pass | Both are single-state `motion.div` roots wrapped by `ChatDemo`'s new `AnimatePresence`, so entrance and exit both play (nested-exit works through `AnimatePresence` context regardless of the extra wrapper `div` in the artifact-panel branch) |
| 4 | ImagePreview fade(+rise) in and out, including the loading-skeleton → loaded-image handoff | code trace | **gap** | Entrance works (mount plays `initial`→`animate`). Exit does not: `ImagePreview` returns two different `motion.div` subtrees depending on `loading`, but neither branch is wrapped in its own `AnimatePresence`. `exit` only plays under an `AnimatePresence` ancestor, and `ChatDemo` never toggles `loading` on `ImagePreview` (see below), so the only place this switch is reachable is the Storybook `loading` control — where the skeleton will disappear instantly rather than fading out. See Critical/Suggestions below. |
| 5 | ChatDemo message entrance on arrival | code trace | pass | Each user/assistant block wrapped in `motion.div` with `messageEnterVariants`; messages are only ever appended, never removed, so no `AnimatePresence`/exit is needed there |
| 6 | ChatDemo streaming caret smoother treatment + reduced-motion collapse | code trace | pass | `motion.span` opacity loop replaces the old `steps(1)` CSS blink; `reducedMotion` branch swaps to a static `{opacity: 0.6}` with no transition |
| 7 | `prefers-reduced-motion: reduce` collapses durations near-zero | code trace | pass | `tokens.css` media query collapses the three `--motion-duration-*` vars to `1ms`; `useMotionDurations()` mirrors this in JS to `0.01`s for Framer Motion call sites reading `useReducedMotion()` |
| 8 | Regression: `MessageBubble`/`WebSearchCard` via `Card` without `onClick` render unchanged | code trace | pass | `clickable` is `false` when no `onClick`, so no `cursor-pointer`, `role`, `tabIndex`, or hover/press motion classes/props are added — only the always-present `transition-colors` class is new (no visual effect without a hover trigger) |

### Requirements coverage
- [x] `--motion-duration-*`/`--motion-ease-*` tokens in `tokens.css`, used as source for the rest
- [x] Framer Motion added as a runtime dependency (`package.json`, `pnpm-lock.yaml`)
- [x] `Button`/clickable `Card` hover/focus/press transitions
- [x] `Lightbox`/`ImagePreview`/`ArtifactPanel` animate in/out on mount/unmount — **partially**: `Lightbox` and `ArtifactPanel` do; `ImagePreview`'s own internal loading↔loaded switch only animates in, not out (see gap above)
- [x] `ChatDemo` message entrance + smoother streaming caret
- [x] `prefers-reduced-motion: reduce` respected throughout
- [x] No automated tests added for the animation layer; existing tests cited as unaffected
- [x] Out-of-scope components (`Chart`, `JsonViewer`, `CodeBlock`) untouched; no prop/API consolidation attempted

### Issues found (from review)
- 🟡 Minor: `ImagePreview`'s loading-skeleton → loaded-image switch doesn't exit-animate (no local `AnimatePresence` around the two branches) — `src/components/ImagePreview/ImagePreview.tsx:36-101`
- 🟡 Minor: `tailwind.config.js`'s `animate-caret` keyframe is now dead code — its only usage was removed from `AssistantMessage.tsx` in this PR and replaced with the Framer Motion caret, but the Tailwind config entry itself wasn't cleaned up

### Implement test results (cited, not re-run)
- `pnpm test` (vitest): 166 passed, 0 failed across 24 component test files; one pre-existing, unrelated failure to *collect* (`bin/send-to-honeycomb.test.js`, a Node-native-test-runner file under vitest) present on `main` before this branch.
- `pnpm typecheck`: clean.
- `pnpm lint`: 50 pre-existing errors, all in `bin/send-to-honeycomb.js`/`.test.js`, confirmed identical on `main`; zero new lint errors in touched files.
- `pnpm build` / `pnpm build-storybook`: both clean.

### Gaps in test coverage
- None beyond what clarify round 5 already scoped out (no automated tests for the animation layer itself — Storybook is the verification surface, consistent with issue #5's precedent).

### Tests/build in review
- **Not run** — review is diff + code reading only; implement phase owns execution.

## Principles review

### Summary
Solid, well-scoped implementation of the approved animation pass: tokens are centralized in `tokens.css` with a JS-side mirror documented as manually-kept-in-sync, `prefers-reduced-motion` is handled at both the CSS and Framer Motion layers, and the `Card` clickable-opt-in design is clean (motion, a11y role/tabIndex, and keyboard activation switch on together off a single `onClick` check, so no risk of a card looking clickable without being keyboard-operable or vice versa). `MotionConflictingProps`/`Omit` on every prop type that spreads onto a `motion.*` element is a tidy fix for the native-prop-name collisions Framer Motion introduces. The one real gap is `ImagePreview`'s internal loading→loaded switch not getting an exit animation, which the implement-handoff's own suggested review scenario explicitly calls out as something to verify — worth a quick follow-up but not blocking, since it's Storybook-only (the demo app never toggles `ImagePreview`'s `loading` prop) and degrades gracefully (skeleton just disappears a beat early rather than rendering broken).

### Critical (must fix)
- None.

### Suggestions (should consider)
- `src/components/ImagePreview/ImagePreview.tsx`: wrap the `loading ? <skeleton> : <image>` return in a local `<AnimatePresence mode="wait">` (each branch already has `key`-worthy distinct content) so the skeleton fades out symmetrically with the image fading in, matching what `fadeRiseVariants`' `exit` already declares and what the suggested review scenario in `implement-handoff.md` claims.
- `tailwind.config.js`: drop the now-unused `animate-caret` keyframe/utility, or note it's intentionally kept for potential reuse.

### Nice to have
- None beyond the above.

### Scenario overlap avoided
- Did not re-verify `Button`/`Card` non-animation behavior (disabled state, type, existing className merging) — implement-handoff's cited `pnpm test` run and prior review precedent already cover that; this pass focused on the new motion surface and requirement coverage.

### Principles applied
- Security: no new attack surface — Framer Motion is a presentational-only client dependency, no new data handling.
- Design/maintainability: motion tokens and JS mirror are documented in-code, `MotionConflictingProps` centralizes a recurring typing concern instead of repeating `Omit<...>` boilerplate ad hoc.
- Conventions: matches the existing pattern of extending `HTMLAttributes`, using `cx`, and forwarding `...rest`; `workflow/PROJECT.md`/`language.md` correctly merged per clarify record.

## Recommendation
Mergeable as-is. The `ImagePreview` exit-animation gap and the orphaned Tailwind keyframe are both minor, non-blocking polish items — safe to fix in this PR or a fast follow-up at the author's discretion.
