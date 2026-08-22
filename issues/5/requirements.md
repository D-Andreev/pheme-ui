# Requirements: issue-5

## Original ask
### Problem

There are still no components implemented.

### Proposed solution

[AI Chat Components.html](https://github.com/user-attachments/files/31332040/AI.Chat.Components.html)

### Acceptance criteria

- [ ] These components need to be implemented and available in storybook. Pixel perfect design implementation from the provided html file.

## Clarifications
| # | Question | Answer | Recommended |
|---|----------|--------|-------------|
| 1 | Sandbox can't fetch the linked `AI Chat Components.html` attachment (GitHub attachment endpoints are proxy-blocked, non-repo-scoped). How should the design source reach the session? | Human pasted the raw bundled HTML directly into the session. Unpacked, it's a Claude Design canvas export ("Nocturne" design system) with 8 sections: (1) Messages — user bubble, assistant flush-left, streaming caret, actions row, error+retry, empty state; (2) Thinking & Tool Calls — collapsed/expanded reasoning blocks, running/success/failed tool call cards with args+result bands; (3) Markdown/Code/JSON/Math — headings, lists, blockquote, tables, syntax-highlighted code blocks, diff blocks, collapsible JSON tree viewer, inline+block math; (4) Media & Files — image preview (loading skeleton + loaded + hover actions), 2×2 image grid with overflow tile, lightbox overlay, video embed with scrubber, attachment cards (uploading/error/success); (5) Sources/Search/Charts — inline citation markers + source list, web search result card, generated bar chart (inline SVG), suggested follow-up buttons, split-view artifact/canvas panel; (6) Composer — empty/focus/attachments/generating/over-limit states; (7) Mobile (390px) recreations of thread+composer and tool-call+code+media; (8) Light theme token remap. Design tokens: dark-first (`--color-bg #161826`, `--color-surface #232532`), accent `#9184d9` (blurple, used only as line/ring/glow, never a flood), Inter 400/500/600/700, radii 4/8/14, an 8px-ish spacing scale, and a signature "fading rule" divider treatment. | Given the size (8 systems, dozens of states), treat this issue as scoping the full spec but scaling delivery — see Q2 below for what ships in this PR vs. deferred. |
| 2 | This is a huge spec (8 systems, 25-30+ component/state combinations, several needing non-trivial logic — syntax highlighting, a JSON tree, math rendering, a lightbox, video controls). Ship everything in this one issue, or scope down to the message/composer "spine" now and defer media/markdown-rendering/search/mobile/light-theme to follow-ups? | Implement everything — full scope, all 8 sections, in this issue. | Scope down to the message-thread + composer spine first; recommendation not taken. |
| 3 | `pheme-ui` currently ships zero runtime dependencies (`Button`/`Card` are pure presentational primitives). Should the harder pieces (syntax-highlighted code, JSON tree, math rendering, lightbox nav, video scrubber) stay presentational (consuming app supplies pre-rendered content/logic), or be fully functional components backed by real libraries? | (b) Fully functional — add real dependencies so e.g. `CodeBlock` takes a raw string and highlights it itself, `MathBlock` takes LaTeX and renders it, etc. | (a) Presentational only, matching the existing zero-dependency `Button`/`Card` posture; recommendation not taken. |
| 4 | Which syntax-highlighting library — Prism/highlight.js (CSS-class tokens, themeable via Nocturne's own `--color-*` tokens) or Shiki (better grammars, but bakes theme colors in as inline styles)? | Prism. | Prism or highlight.js — Prism (or highlight.js) taken as-is. |
| 5 | For math rendering — KaTeX (fast, covers this UI's needs) or MathJax (heavier, broader LaTeX coverage not needed here)? | KaTeX. | KaTeX; taken as-is. |
| 6 | Does "fully functional" extend to the whole markdown surface — a `Markdown`/`MessageContent` component that parses a raw markdown string end-to-end (headings/lists/tables/blockquote, routing fenced code into `CodeBlock` and math into `MathBlock`) — or do structural elements stay CSS-only styling applied to app-parsed markup, with only `CodeBlock`/`MathBlock` independently functional? | The full pipeline — `react-markdown` + `remark-gfm` + `remark-math`/`rehype-katex`, with a custom renderer routing fenced code through `CodeBlock`. | Full pipeline; taken as-is. |

## Acceptance criteria
- [ ] ...

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
