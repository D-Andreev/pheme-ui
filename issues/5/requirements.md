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

## Acceptance criteria
- [ ] ...

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
