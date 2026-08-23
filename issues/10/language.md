## Language

- **Animation pass (issue #10)** — system-wide, not scoped to `ChatDemo`. New
  transition/animation tokens are added to Nocturne (`tokens.css`) and
  applied as baseline micro-interactions (hover/focus/press states, entrance
  transitions) across all presentational components in the library, per
  clarify round 1.
- **Framer Motion** — per clarify round 2, issue #10 pulls in Framer Motion
  as a new runtime dependency for animation orchestration (rather than
  CSS-only `transition`/`@keyframes`). This breaks the "presentational,
  CSS-token-driven" posture further, alongside the Prism/KaTeX/react-markdown
  dependencies already added in issue #5.
- **"Simplify UI" (issue #10)** — per clarify round 3, this is explicitly
  **not** a separate visual/API-consolidation workstream for this issue.
  The animation pass (transitions, micro-interactions) is treated as
  satisfying the "simplify UI for better UX" half of the original ask;
  no prop or spacing audit is in scope.
- **Reduced motion (issue #10)** — per clarify round 4, all new
  Framer Motion transitions and CSS `--motion-*` tokens respect
  `prefers-reduced-motion: reduce`, collapsing durations to near-zero for
  users who request it at the OS level.
- **Animation testing (issue #10)** — per clarify round 5, the animation
  layer ships **without** automated tests (no motion-prop/variant
  assertions); verified manually via Storybook, extending the same
  "pixel-perfect" precedent set in issue #5's clarify round 7. Existing
  component tests (non-animation behavior) are unaffected.
- **Baseline animation surface (issue #10)** — per clarify round 6, the
  in-scope surface for this pass is: `Button`/clickable `Card`
  hover-focus-press; entrance/exit for `Lightbox`, `ImagePreview`,
  `ArtifactPanel`; `ChatDemo` message entrance and a smoother streaming/typing
  indicator; plus the `--motion-duration-*`/`--motion-ease-*` tokens backing
  all of it. Chart, JsonViewer, CodeBlock, and everything else are explicitly
  out of scope for this issue.
