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
