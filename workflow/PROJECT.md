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
  `CardTitle`/`CardBody`) in this PR are structural primitives only, not a
  chat implementation. `Card` is the intended basis for a future
  `MessageBubble`, not that component itself.
