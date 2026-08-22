# pheme-ui

React UI component library for building AI chat interfaces — the Nocturne
design system: messages, thinking/tool-call states, markdown/code/math
rendering, media, sources/search, and a composer, all on Tailwind + CSS
custom properties with dark/light theming built in.

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
import { MessageBubble, AssistantMessage, Composer } from "pheme-ui";

function Thread() {
  return (
    <>
      <MessageBubble content="What's the difference between a Card and a MessageBubble?" />
      <AssistantMessage content="A Card is the generic shell; MessageBubble builds on it." />
      <Composer value="" onChange={() => {}} onSubmit={() => {}} />
    </>
  );
}
```

Dark is the default theme. Opt into light by setting
`data-theme="light"` on `<html>` (or any ancestor element).

## Components

- **Primitives** — `Button`, `Card`/`CardTitle`/`CardBody`
- **Messages** — `MessageBubble`, `AssistantMessage`, `ErrorMessage`, `EmptyThread`
- **Thinking & tool calls** — `ThinkingBlock`, `ToolCallCard`
- **Markdown / code / math** — `Markdown` (`MessageContent`), `CodeBlock`, `DiffBlock`, `JsonViewer`, `MathBlock`
- **Media & files** — `ImagePreview`, `ImageGrid`, `Lightbox`, `VideoEmbed`, `AttachmentCard`
- **Sources / search / charts** — `Citation`/`SourceList`, `WebSearchCard`, `Chart`, `SuggestedFollowUps`, `ArtifactPanel`
- **Composer** — `Composer`

Browse them interactively in [Storybook](http://blog.dimitarandreev.com/pheme-ui/)
(deployed from `main`).

## Development

```sh
pnpm install
pnpm dev             # tsup --watch
pnpm storybook       # Storybook dev server
pnpm test            # Vitest
pnpm lint            # ESLint
pnpm typecheck       # tsc --noEmit
pnpm build           # tsup — ESM + CJS + .d.ts + styles.css
```

Requires Node `>=22` and [pnpm](https://pnpm.io).

## Releasing

Record a change with `pnpm changeset`, merge to `main`, then trigger the
`Release` GitHub Actions workflow manually (Actions tab → *Release* → Run
workflow, or `gh workflow run release.yml`). It opens/updates a version PR
via [Changesets](https://github.com/changesets/changesets) when changesets
are pending, and publishes to npm once that PR is merged and the workflow
is run again.

## License

MIT
