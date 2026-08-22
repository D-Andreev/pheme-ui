## Language

- **Nocturne** — the design system name for this mockup: dark-first token set
  (`--color-bg #161826`, `--color-surface #232532`, accent `#9184d9`), Inter
  400/500/600/700, radii 4/8/14. Matches (and extends) the existing
  `workflow/PROJECT.md` "Design tokens / Nocturne" language from issue #2 —
  this issue's components consume those same tokens, not a new palette.
- **Fading rule** — the system's signature divider treatment: a 1px line
  that fades to transparent over 48px at each end via a linear-gradient,
  instead of terminating with a hard edge. Used for `.hr`, table row
  separators, and section dividers.
- **Thinking block** — a collapsible reasoning/chain-of-thought display,
  distinct from a **tool call** card (which shows a tool name, arguments,
  and a result, with running/success/failed states).
- **Message actions row** — the ghost-button row (Copy/Retry/Good/Bad/etc.)
  that appears below a message, reserved-height so hover doesn't shift
  layout.
- **Artifact / canvas panel** — a split-view mode where the thread narrows
  to ~220px and a side panel shows a generated document/preview with its
  own header (version, preview/code toggle, export).
- **Fully functional (vs. presentational)** — per clarify round 3, this
  issue breaks `pheme-ui`'s zero-runtime-dependency posture (`Button`/
  `Card` from issue #2). New dependencies added here: **Prism** (syntax
  highlighting, themed via Nocturne's own `--color-*` tokens rather than a
  baked-in theme), **KaTeX** (math rendering), and **`react-markdown` +
  `remark-gfm` + `remark-math`/`rehype-katex`** (the full markdown pipeline
  behind `Markdown`/`MessageContent`, with a custom renderer routing fenced
  code through `CodeBlock`).
- **"Pixel-perfect" verification** — per clarify round 7, satisfied by
  behavior-focused TDD tests (props/states/interactions) plus manual
  comparison of each Storybook story against the mockup — not automated
  visual-regression tooling, which is out of scope for this issue.
