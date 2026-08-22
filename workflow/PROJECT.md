# Language

- **Design tokens / "Nocturne"** — the CSS custom-property design system behind
  `src/styles/tokens.css`, sourced from the approved design mockup
  (issue #2). Dark is the default theme (`:root`); light is an override via
  `[data-theme="light"]`, not a separate token set.
- **Status colors (`danger`, `success`)** — present in the issue's
  `tailwind.config.js` but not defined in the design mockup itself (they're
  described there as promoted from a later "chat-components board" we don't
  have). Values in `tokens.css` are an assumption (standard red/green pair);
  revisit against the real board when it's shared.
- **Shell components** — per clarify round 2, `Button` and `Card` (with
  `CardTitle`/`CardBody`) shipped in issue #2 as structural primitives only.
  Issue #5 is the chat implementation built on top of them: `MessageBubble`
  is the `Card`-based user bubble; `Button` backs the composer's send
  control and every message-actions row.
- **Fading rule** — the system's signature divider treatment: a 1px line
  that fades to transparent over 48px at each end via a linear-gradient,
  instead of terminating with a hard edge. Used for `.hr`, table row
  separators, and section dividers throughout issue #5's components.
- **Thinking block vs. tool call** — a **thinking block** is a collapsible
  reasoning/chain-of-thought display (`ThinkingBlock`); a **tool call** is a
  separate card (`ToolCallCard`) showing a tool name, arguments, and a
  result, with running/success/failed states.
- **Message actions row** — the ghost-button row (Copy/Retry/Good/Bad/etc.)
  under `AssistantMessage`, reserved-height so hover doesn't shift layout.
- **Artifact / canvas panel** (`ArtifactPanel`) — a split-view mode where
  the thread narrows and a side panel shows a generated document/preview
  with its own header (version, preview/code toggle, export).
- **Fully functional (vs. presentational)** — per clarify round 3, issue #5
  breaks `pheme-ui`'s previous zero-runtime-dependency posture. New
  dependencies: **Prism** (`CodeBlock`/`DiffBlock` syntax highlighting,
  themed via Nocturne's own `--color-*` tokens rather than a baked-in
  theme), **KaTeX** (`MathBlock` math rendering), and **`react-markdown` +
  `remark-gfm` + `remark-math`/`rehype-katex`** (the full pipeline behind
  `Markdown`/`MessageContent`, with a custom renderer routing fenced code
  through `CodeBlock` and math through `MathBlock`).
- **"Pixel-perfect" verification** — per clarify round 7, satisfied by
  behavior-focused TDD tests (props/states/interactions) plus manual
  comparison of each Storybook story against the mockup description
  captured in clarify — not automated visual-regression tooling, which is
  out of scope for this issue. The mockup HTML itself could not be
  persisted to the repo (GitHub attachment endpoints are proxy-blocked for
  the sandbox); component sizing/spacing follows the token scale
  (`--space-*`, `--radius-*`) and the written mockup description rather
  than pixel measurements read directly off the file.
- **Chat demo (`ChatDemo`)** — per issue #8's clarify round, a new
  interactive, stateful component living at `src/demo/ChatDemo.tsx`
  (Storybook-only, deliberately **not** re-exported from `src/index.ts`)
  that wires the existing presentational components into a live
  send/receive loop: the user types into `Composer`, a keyword match
  against their message picks a canned mock response, and the matching
  showcase component(s) render in the thread with a simulated
  generating/streaming delay. Distinct from the per-component
  `*.stories.tsx` files (each of which demos exactly one component in
  isolation) — `ChatDemo` is the one place all of them are wired together
  end to end. Ships without its own test file by explicit human answer in
  clarify (existing per-component tests are unaffected).
