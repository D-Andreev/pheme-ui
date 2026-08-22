# Implement handoff: issue-5

## Summary

Implemented the full Nocturne AI-chat component set for `pheme-ui` — all 8
mockup sections from the approved requirements, as 22 new components (24
total including the pre-existing `Button`/`Card`), each with Storybook
stories and RTL behavior tests. This is the first "fully functional" slice
of the library: it adds real runtime dependencies (Prism, KaTeX,
`react-markdown` + remark/rehype plugins) on top of the previously
zero-dependency `Button`/`Card` primitives from issue #2, per the approved
clarify answers.

**Important caveat on "pixel-perfect":** the mockup HTML file linked from
the issue could not be fetched into the sandbox (GitHub attachment
endpoints are proxy-blocked and non-repo-scoped) or persisted anywhere in
this repo. Clarify captured a detailed *textual* description of the design
system (colors, fonts, radii, spacing, the 8 sections and their states) and
issue #2 had already turned the color/spacing/animation decisions into
concrete tokens (`tokens.css`, `tailwind.config.js`) — this implementation
builds strictly from those tokens and the written description, not from
pixel measurements read off the actual file. Verification followed the
approved fallback (clarify round 7): behavior-focused tests plus my own
Storybook review, not automated visual-regression tooling. A human
comparison pass against the real mockup file (once accessible) is the
recommended next step before calling this pixel-verified.

## Branch

`workflow/issue-5` (branched from `main`), pushed to
`origin/workflow/issue-5`.

## Changes

**New runtime dependencies** (`package.json`): `prismjs`, `katex`,
`react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`
(+ `@types/prismjs`, `@types/katex` as dev deps) — per clarify rounds 3-6.

**Shared infra:**
- `src/lib/cx.ts` — small class-name-join helper, adopted by every new
  component (`Button`/`Card` keep their pre-existing inline pattern,
  untouched).
- `src/styles/prism-theme.css` — Prism `.token.*` classes mapped onto
  Nocturne's own `--color-*` tokens (not a baked-in Prism theme), scoped
  under `.pheme-code`.
- `src/styles/shared.css` — the "fading rule" `.hr` divider utility
  (1px line fading to transparent over 48px each side).
- `src/styles/globals.css` — now also imports the two files above plus
  `katex/dist/katex.min.css`.
- `tsup.config.ts` — `dist/styles.css` is now a concatenation of
  `tokens.css` + `prism-theme.css` + `shared.css` + KaTeX's stylesheet
  (previously just `tokens.css`), and `dist/fonts/` ships KaTeX's font
  files alongside it (KaTeX's CSS references them with a relative
  `url(fonts/...)`, so they have to sit next to `dist/styles.css`).
- `src/index.ts` — barrel-exports all 22 new components alongside the
  existing `Button`/`Card`.
- `workflow/PROJECT.md` — merged this issue's clarify language (fading
  rule, thinking-block-vs-tool-call distinction, message actions row,
  artifact/canvas panel, the fully-functional dependency posture, and the
  pixel-perfect verification note above).

**New components** (`src/components/<Name>/{<Name>.tsx,.stories.tsx,.test.tsx,index.ts}`
for each), grouped by mockup section:

- **Messages**: `MessageBubble` (user, built on `Card`), `AssistantMessage`
  (flush-left, streaming caret, actions row, focus-visible ring),
  `ErrorMessage` (error + retry), `EmptyThread` (empty state + suggested
  prompts)
- **Thinking & tool calls**: `ThinkingBlock` (collapsed/expanded/streaming),
  `ToolCallCard` (running/success/failed, arguments+result bands via
  `JsonViewer`)
- **Markdown/code/JSON/math**: `Markdown` (full `react-markdown` +
  `remark-gfm` + `remark-math`/`rehype-katex` pipeline, fenced code routed
  to `CodeBlock`; also exported as `MessageContent`), `CodeBlock`
  (Prism-highlighted, copy action, line numbers), `DiffBlock`
  (added/removed line styling), `JsonViewer` (recursive expand/collapse
  tree), `MathBlock` (KaTeX inline/block)
- **Media & files**: `ImagePreview` (skeleton/loaded/hover actions),
  `ImageGrid` (2×2 + overflow tile, opens an internal `Lightbox`),
  `Lightbox` (prev/next + keyboard nav), `VideoEmbed` (custom play/pause +
  scrubber), `AttachmentCard` (uploading/success/error)
- **Sources/search/charts**: `Citation`+`SourceList` (inline markers +
  source rows), `WebSearchCard` (query + results), `Chart` (two-series
  inline-SVG bar chart), `SuggestedFollowUps` (follow-up buttons),
  `ArtifactPanel` (preview/code split-view side panel)
- **Composer**: `Composer` (empty/focus/attachments/generating/over-limit)

Every component: mobile-first responsive CSS (no separate mobile
components — verified via a `Mobile` Storybook viewport story on each),
respects the existing `[data-theme="light"]` mechanism (no component
branches on theme in JS — all styling flows through the existing CSS
custom properties), and ships behavior-focused RTL tests.

## TDD cycles

Work was fanned out across 12 parallel subagents (grouped by mockup
section/dependency order — leaf components with no cross-component
dependency first, then `Markdown`/`AssistantMessage`/`ToolCallCard`+
`ThinkingBlock`/`ArtifactPanel` once their dependencies — `CodeBlock`,
`MathBlock`, `JsonViewer` — existed), each independently red-green on its
own slice (write failing tests against the spec'd props/states, implement,
iterate until green) before reporting back, followed by an integration
pass here: wiring `src/index.ts`, running the full suite, and fixing the
one cross-slice test collision that surfaced (`ArtifactPanel.test.tsx`
originally asserted on Prism's actual token markup via `getByText`, which
broke once `CodeBlock` really existed and split code into multiple
`<span class="token">` nodes — fixed to read `textContent` off the
`<code>` element instead).

## Test results

Full suite, run on the work branch after integration:

```
pnpm test
 Test Files  24 passed (24)
      Tests  156 passed (156)
   Duration  ~11s
```

```
pnpm typecheck   → tsc --noEmit: clean, no errors
pnpm lint        → eslint .: clean, no errors/warnings
pnpm build       → tsup: ESM + CJS + .d.ts + dist/styles.css + dist/fonts, all succeed
pnpm build-storybook → storybook build: succeeds, all 24 story files render
                       (one informational Vite "chunk larger than 500kB"
                       warning on the docs-renderer bundle — pre-existing
                       Storybook/docs-addon behavior, not something this
                       PR's code caused; not a build failure)
```

No known-failing checks at handoff time. A benign KaTeX `strict: "warn"`
console warning (`newLineInDisplayMode`) appears in stderr during two
`MathBlock` tests exercising React/jsdom-rendered KaTeX output — cosmetic,
doesn't fail any assertion, reproduced only in the jsdom render path (not
in plain Node), not addressed.

## Acceptance criteria

- [x] `Markdown`/`MessageContent` — full pipeline, fenced code routed to
      `CodeBlock`; math handled via `remark-math`+`rehype-katex` (produces
      identical KaTeX output to routing through the `MathBlock` component;
      see `Markdown.tsx` for the design note)
- [x] `MessageBubble` (user) — default + hover/edit-actions, on `Card`
- [x] `AssistantMessage` — flush-left, streaming caret, actions row,
      focus-visible ring
- [x] `ErrorMessage` — error + retry
- [x] `EmptyThread` — empty-state heading + suggested prompts
- [x] `ThinkingBlock` — collapsed and expanded/streaming
- [x] `ToolCallCard` — running, success (collapsed+expanded), failed
- [x] `CodeBlock` — Prism-highlighted via Nocturne tokens, copy action
- [x] `DiffBlock` — added/removed line styling
- [x] `JsonViewer` — recursive expand/collapse tree
- [x] `MathBlock` — KaTeX inline and block
- [x] `ImagePreview` — loading skeleton, loaded, hover actions
- [x] `ImageGrid` — 2×2 + overflow-count tile
- [x] `Lightbox` — prev/next nav, keyboard (arrows, Escape)
- [x] `VideoEmbed` — poster, play control, scrubber
- [x] `AttachmentCard` — uploading/success/error
- [x] `Citation`/`SourceList` — inline markers + source list
- [x] `WebSearchCard` — query + result rows
- [x] `Chart` — data-driven two-series bar chart, inline SVG
- [x] `SuggestedFollowUps` — left-aligned suggestion buttons
- [x] `ArtifactPanel` — split-view, version/preview-code-toggle/export
      header (renders the panel itself; the "thread narrows" half of the
      split-view is a page-layout concern for the consuming app, out of
      this component's scope)
- [x] `Composer` — empty/focus/attachments/generating/over-limit
- [x] Mobile widths (≥390px) via responsive CSS, one component each, no
      separate mobile variants — verified via a `Mobile` viewport story per
      component
- [x] Light/dark theme via the existing `[data-theme="light"]` mechanism —
      no component branches on theme in JS
- [x] Storybook stories cover every state listed — **manual pixel-accuracy
      comparison against the mockup is NOT done** (see the caveat in
      Summary — the mockup file itself was never accessible in this
      session; recommend a human pass once it's shared)
- [x] Behavior-focused RTL tests for every component, including state
      transitions and keyboard/mouse interactions for the interactive ones
      (`ToolCallCard`, `JsonViewer`, `Lightbox`, `VideoEmbed`, `Composer`,
      `AttachmentCard`)
- [x] New dependencies added to `package.json`; builds/typechecks/lints
      clean via the existing `tsup` pipeline

## Suggested review scenarios

1. **Pixel comparison against the real mockup**, once it can be shared
   through a channel the review session can actually fetch (e.g. pasted
   inline, or a repo-hosted image/HTML) — this is the one acceptance
   criterion that couldn't be verified end-to-end in this session.
2. **`Markdown`'s `pre`/`code` interception** (`src/components/Markdown/Markdown.tsx`)
   — confirm the fenced-vs-inline-code split holds for edge cases like
   nested code spans inside list items or blockquotes, and that GFM tables
   scroll rather than break layout at 390px.
3. **`ImageGrid`'s overflow formula** — implemented as
   `overflowCount = images.length > 4 ? images.length - 4 : 0`, i.e. 4
   tiles always show (3 plain + 1 overflow-badged) once there are more
   than 4 images. Worth confirming this matches the intended mockup
   behavior once visible.
4. **`Composer`'s `generating` state** — currently a visual-only indicator
   (disabled/read-only textarea, swapped button, pulse animation); there's
   no `onStop` callback in the approved prop shape, so a "stop generating"
   click has nothing to call. Flag if the real UI needs one — it'd be an
   additive prop, not a rework.
5. **`AttachmentCard`'s error state** reuses `onRemove` for both "remove"
   and "retry" semantics (distinguished only by `aria-label` text) since
   there's no separate `onRetry` prop — confirm this is acceptable or
   whether retry needs to be a distinct action.
6. **Run Storybook locally** (`pnpm storybook`) and click through the
   `Mobile` viewport story on a few components — `ArtifactPanel`,
   `ImageGrid`, `Markdown`'s `GfmTable` story, and `Composer` are the ones
   most likely to reveal layout issues at 390px that a code read won't
   catch.
