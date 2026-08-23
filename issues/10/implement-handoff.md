# Implement handoff: issue-10

## Summary

Adds the baseline animation pass approved in `requirements.md`: new
`--motion-duration-*`/`--motion-ease-*` tokens in Nocturne, Framer Motion as
a runtime dependency, hover/focus/press micro-interactions on `Button` and
clickable `Card`, entrance/exit animation on `Lightbox`, `ImagePreview`, and
`ArtifactPanel`, and — inside `ChatDemo` — message-arrival animation plus a
smoother streaming/typing caret. Every animation respects
`prefers-reduced-motion: reduce`. No automated tests were added for the
animation layer itself (clarify round 5); existing non-animation component
tests are untouched and stay green.

## Branch

`workflow/issue-10` off `main`.

## Changes

- `src/styles/tokens.css` — new `--motion-duration-fast/base/slow` and
  `--motion-ease-standard/out/in` custom properties, plus a
  `@media (prefers-reduced-motion: reduce)` block that collapses the
  duration tokens to `1ms`.
- `package.json` — added `framer-motion` (`^12.43.0`) as a runtime
  dependency.
- `src/lib/motion.ts` (new) — shared animation helpers: `MOTION_DURATION`/
  `MOTION_EASE` (JS-side mirror of the CSS tokens, since a Framer Motion
  `transition` object can't read a CSS custom property), `useMotionDurations()`
  / `useMotionTransition()` (reduced-motion-aware, wraps Framer Motion's own
  `useReducedMotion()`), reusable `fadeRiseVariants` / `fadeVariants` /
  `messageEnterVariants`, and the `MotionConflictingProps` type (native
  drag/animation-lifecycle prop names that `motion.*` components redefine,
  `Omit`'d from every component prop type that spreads onto a `motion.*`
  element).
- `src/components/Button/Button.tsx` — `<button>` → `motion.button` with
  `whileHover`/`whileTap`/`whileFocus` scale feedback (skipped when
  `disabled`) and a token-driven `transition-colors` class for the existing
  Tailwind hover/active background classes.
- `src/components/Card/Card.tsx` — `<div>` → `motion.div`. A `Card` becomes
  interactive the moment a consumer passes `onClick`: hover/focus/press
  scale motion, `cursor-pointer`, `role="button"`, `tabIndex={0}`, and
  Enter/Space keyboard activation switch on together. No existing usage in
  the library passes `onClick` to `Card` yet, so behavior for current
  consumers (`MessageBubble`, `WebSearchCard`) is unchanged; added a
  `Clickable` story to exercise the new path.
- `src/components/Lightbox/Lightbox.tsx` — root `<div>` → `motion.div` with
  a fade entrance/exit (`fadeVariants`).
- `src/components/ImagePreview/ImagePreview.tsx` — both the loading-skeleton
  and loaded-image roots → `motion.div` with a fade+rise entrance/exit
  (`fadeRiseVariants`).
- `src/components/ArtifactPanel/ArtifactPanel.tsx` — root `<div>` →
  `motion.div` with the same fade+rise entrance/exit.
- `src/components/AssistantMessage/AssistantMessage.tsx` — the streaming
  caret (`data-testid="streaming-caret"`) is now a `motion.span` doing a
  smooth opacity fade loop instead of the old `animate-caret` CSS
  `steps(1)` blink; collapses to a static dim caret under reduced motion.
- `src/demo/ChatDemo.tsx` — each rendered message (user bubble and
  assistant block) is wrapped in a `motion.div` using `messageEnterVariants`
  so it animates in on arrival. The artifact-panel and `Lightbox`
  conditionals are now wrapped in `AnimatePresence` so their nested
  `motion` components' exit animations actually get to play instead of
  being cut off by an instant unmount.
- `src/components/Card/Card.stories.tsx` — added a `Clickable` story
  (onClick + hover/focus/press) for manual verification.
- `workflow/PROJECT.md` — merged issue #10's `language.md` entries into
  `## Language`.

## TDD cycles

None — per clarify round 5, the animation layer is explicitly out of scope
for automated testing (Framer Motion animations aren't observable in jsdom,
which doesn't run real layout/animation; verification is manual via
Storybook, same precedent as issue #5's "pixel-perfect" verification).
Existing tests were used as a correctness harness throughout instead: every
touched component's test file was re-run after each change to confirm the
`motion.*` swap didn't alter rendered output, event handling, or DOM
structure that those tests assert on (e.g. `Card.test.tsx`'s
`container.firstElementChild` elevation-class checks, `Lightbox.test.tsx`'s
synchronous focus-trap/restoration assertions, `Button.test.tsx`'s
type/disabled/onClick checks).

## Test results

`pnpm test` (vitest): **166 passed**, 0 failed, across all 24 component
test files (including `Button`, `Card`, `Lightbox`, `ImagePreview`,
`ArtifactPanel`, `AssistantMessage`). One suite —
`bin/send-to-honeycomb.test.js` — fails to collect under vitest
("No test suite found"); this is a pre-existing, unrelated issue (it's a
Node-native-test-runner file, not a vitest file) confirmed present on `main`
before this branch's changes, not introduced here.

`pnpm typecheck` (`tsc --noEmit`): clean, no errors.

`pnpm lint` (`eslint .`): 50 pre-existing errors, all in
`bin/send-to-honeycomb.js` / `bin/send-to-honeycomb.test.js` (untyped
Node script using `require`/`console`/`process`/`module` without Node
globals configured for ESLint) — confirmed identical on `main` before this
branch's changes; zero lint errors in any file this issue touched.

`pnpm build` (`tsup`): clean — ESM/CJS/DTS all build successfully.

`pnpm build-storybook`: clean — all stories, including the new `Clickable`
Card story, build successfully.

## Acceptance criteria

- [x] New `--motion-duration-*` / `--motion-ease-*` tokens added to
      `tokens.css` (Nocturne), used as the source of all durations/easings
      below
- [x] Framer Motion added as a runtime dependency
- [x] `Button` (all variants) and clickable `Card` have hover/focus/press
      transitions
- [x] `Lightbox`, `ImagePreview`, and `ArtifactPanel` animate in/out on
      mount/unmount (open/close)
- [x] `ChatDemo`: new messages animate in on arrival; the simulated
      streaming/typing indicator gets a smoother animated treatment
- [x] All of the above respect `prefers-reduced-motion: reduce` (durations
      collapse to near-zero)
- [x] No automated tests added for the animation layer itself; existing
      non-animation component tests remain green; verified manually via
      Storybook
- [x] Out of scope: `Chart`, `JsonViewer`, `CodeBlock`, and any component
      not listed above; no prop/API consolidation ("simplify" is satisfied
      by the animation pass itself, not a separate visual/API audit) —
      untouched

## Suggested review scenarios

1. **Storybook — Button**: hover, focus (tab to it), and press each
   variant (`primary`/`secondary`/`ghost`, plain and `icon`); confirm a
   smooth scale + color transition, not an instant snap.
2. **Storybook — Card → Clickable**: hover/focus/press the card; confirm
   `role="button"`, that Enter and Space both fire `onClick`, and that the
   `Default`/`Elevated` stories (no `onClick`) stay inert (no
   cursor-pointer, no scale motion) — clickable behavior is opt-in via
   `onClick` only.
3. **Storybook — Lightbox / ImagePreview / ArtifactPanel**: open and close
   each (`ImageGrid` → click a thumbnail for `Lightbox`; `ImagePreview`'s
   `loading` control toggled for the skeleton→image fade); confirm a fade
   (+ rise for `ImagePreview`/`ArtifactPanel`) both in and out, not an
   instant appear/disappear.
4. **Storybook — ChatDemo**: send a few messages (try `help`, `code`,
   `artifact`, `images`) and confirm each new message/block animates in;
   watch the assistant's streaming text for the smoother fading caret
   (vs. the old hard blink); open/close the artifact panel via the
   `artifact` trigger and its `Close` button, and open/close the lightbox
   via an image's expand action — confirm both animate in and out cleanly
   (`AnimatePresence` keeps them mounted long enough to finish the exit).
5. **Reduced motion**: enable "reduce motion" at the OS level (or emulate
   `prefers-reduced-motion: reduce` in devtools), reload Storybook, and
   repeat scenarios 1–4 — every transition/animation above should collapse
   to near-instant rather than looking broken or half-animated.
6. **Regression — existing components**: spot-check `MessageBubble` and
   `WebSearchCard` (both use `Card` without `onClick`) still render exactly
   as before — no stray hover state, cursor, or motion.
