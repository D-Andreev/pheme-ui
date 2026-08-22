# pheme-ui

React UI component library for building AI chat interfaces.

This is the **initial structure** of the project — build/lint/test/publish
tooling, Storybook, and Tailwind theming are wired up, and two structural
primitives ship as a proof of the setup. No chat implementation yet; that
lands in follow-up issues.

## Install

```sh
pnpm add pheme-ui
```

`react` and `react-dom` `>=18` are peer dependencies — install them in your
app if you haven't already.

## Usage

Import the compiled styles once (e.g. in your app's entry point) and add
`pheme-ui`'s output to your own Tailwind `content` globs so its utility
classes aren't purged:

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/pheme-ui/dist/**/*.{js,mjs}"],
  // ...
};
```

```tsx
import "pheme-ui/styles.css";
import { Button, Card, CardTitle, CardBody } from "pheme-ui";

function Example() {
  return (
    <Card>
      <CardTitle>Assistant</CardTitle>
      <CardBody>Structural shell only — no chat logic yet.</CardBody>
      <Button variant="primary">Send</Button>
    </Card>
  );
}
```

Dark is the default theme. Opt into light by setting
`data-theme="light"` on `<html>` (or any ancestor element).

## Components

| Component | Status |
|-----------|--------|
| `Button`  | primary / secondary / ghost variants, icon + block modifiers |
| `Card`, `CardTitle`, `CardBody` | generic surface shell — the structural basis for a future message bubble |

Browse them interactively in [Storybook](https://d-andreev.github.io/pheme-ui/)
(deployed from `main`).

## Development

```sh
pnpm install
pnpm dev           # tsup --watch
pnpm storybook      # Storybook dev server
pnpm test           # Vitest
pnpm lint           # ESLint
pnpm typecheck       # tsc --noEmit
pnpm build           # tsup — ESM + CJS + .d.ts + styles.css
```

Requires Node `>=20` and [pnpm](https://pnpm.io).

## Releasing

Versioning and npm publish go through
[Changesets](https://github.com/changesets/changesets): run `pnpm changeset`
to record a change, merge to `main`, and the `Release` GitHub Actions
workflow opens a version PR (or publishes once that PR merges).

## License

MIT
