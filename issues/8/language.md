## Language

- **Chat demo (`ChatDemo`)** — per clarify Q1, a new interactive, stateful
  component (Storybook-only, not exported from `src/index.ts`) that wires
  the existing presentational components into a live send/receive loop:
  the user types into `Composer`, a keyword match against their message
  picks a canned mock response, and the matching showcase component(s)
  render in the thread.
