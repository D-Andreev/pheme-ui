# Review Report

**Fresh-eyes:** artifacts and diff only (`main...HEAD` on `workflow/issue-5`).

## Verdict
REQUEST CHANGES

## Scenario verification

### Scenarios verified

| # | Scenario | Method | Result | Notes |
|---|----------|--------|--------|-------|
| 1 | MessageBubble: short content ("Hi"), right-aligned bubble | code trace (CSS box model) | fail | Wrapper `div` (`MessageBubble.tsx`) has `ml-auto max-w-[85%] sm:max-w-prose` but no `w-fit`/`inline-block`; a block-level box with `width:auto` fills to the max-width cap regardless of margins, so short messages render as a wide box with left-hugging text instead of a snug bubble. Confirmed against `Card`'s own block/flex box (`Card.tsx`), which doesn't override this. The component's own story description ("constrains itself... instead of stretching edge to edge") states the intended behavior this code doesn't achieve. |
| 2 | Lightbox: open, Tab past the dialog, Escape to close | code trace | fail (a11y) | `role="dialog" aria-modal="true"` is set (`Lightbox.tsx`) but there is no initial-focus move, no `Tab`/`Shift+Tab` trap, and no focus restoration to the trigger element on close — the modal claim isn't backed by modal behavior. Keyboard arrow nav and Escape-to-close themselves are correct (verified: paired listener cleanup, correct wraparound math, matches click-handler math). |
| 3 | ImageGrid: 6 images, overflow tile, Lightbox seeded with full set | code trace | pass | `overflowCount = images.length > 4 ? images.length - 4 : 0` yields the spec'd "4 tiles always show" behavior; `Lightbox` receives the full `images` array so prev/next can reach images hidden behind the overflow badge. |
| 4 | Markdown: XSS via raw HTML / injected script in message content | code trace + grep | pass | No `rehype-raw`/`allowDangerousHtml` anywhere in the tree — raw HTML mdast nodes are dropped, not rendered live. The two `dangerouslySetInnerHTML` uses in the diff (`CodeBlock` via `Prism.highlight`, `MathBlock` via `katex.renderToString`) are both fed by libraries that self-escape/self-sandbox (`Prism`'s `util.encode`, KaTeX's default `trust: false`). No `urlTransform` override, so react-markdown's default `javascript:`/`data:` link-scheme block stays in effect. |
| 5 | Markdown: nested inline code span inside a list item / blockquote | code trace | pass | `pre`/`code` renderers are dispatched by mdast node type (fenced vs. inline), not DOM position, so nesting depth doesn't affect fenced-vs-inline routing. One cosmetic gap found (blockquote's `italic` inherits into nested code — logged as a note). |
| 6 | ToolCallCard: running → success (expanded args/result via JsonViewer) → failed, with `error` omitted | code trace | fail (edge case) | State transitions and `aria-expanded` toggling are correct and tested. When `status="failed"` and `error` is `undefined`, the Error band renders an empty box with no fallback text. |
| 7 | VideoEmbed: mount/unmount, all four media event listeners | code trace | pass | All `addEventListener`/`removeEventListener` pairs (`play`, `pause`, `loadedmetadata`, `timeupdate`) match; effect captures the ref's DOM node once with `[]` deps — no leak. |
| 8 | Composer: empty → focus → attachments → generating → over-limit | code trace | pass (with a UX note) | All transitions trace correctly against `canSubmit`/`isOverLimit`/`isEmpty` and are covered by tests. The `generating` state swaps to a Stop-icon button while leaving it fully disabled (no `onStop` prop exists) — implementer already flagged this as an open question in `implement-handoff.md`; logged as a minor finding, not a blocker on its own. |

### Requirements coverage
All 25 acceptance criteria from `requirements.md` have a corresponding component/story/test in the diff (`src/index.ts` barrel-exports all 22 new components; `package.json` adds exactly the six approved runtime dependencies). The one criterion that cannot be verified end-to-end — actual pixel comparison against the source mockup HTML — remains unverified for the reason the implementer already documented (the mockup file was never fetchable into any session); everything else traces cleanly to its acceptance criterion.

### Issues found (from review)
- 🔴 Critical: `MessageBubble` doesn't shrink-wrap to content width (scenario 1) — affects the single most common, most visible component in the library.
- 🟡 Minor: `Lightbox` claims `aria-modal="true"` without focus-trap/restoration behavior (scenario 2).
- 🟡 Minor: `JsonViewer` has no horizontal-overflow handling, inconsistent with every sibling content-bearing component (`MathBlock`, `DiffBlock`, `Markdown`, `CodeBlock` all wrap scrollable content in `overflow-x-auto`).
- 🟡 Minor: `ToolCallCard`'s failed-status Error band has no fallback text when `error` is omitted (scenario 6).
- 🟡 Minor: `Citation`/`WebSearchCard` don't validate external href schemes before rendering LLM/search-provided URLs as links.
- 🟡 Minor: `AttachmentCard` conflates "remove" and "retry" behind one `onRemove` callback (implementer-flagged).
- 🟡 Minor: `Composer`'s generating-state Stop button is a fully inert, visually misleading affordance (implementer-flagged).
- Notes: light-theme contrast gap on new status-color usages (pre-existing token pattern, not new), header-truncation CSS gaps in `CodeBlock`/`DiffBlock`, duplicated Chevron icon / `hostname()` helper, `EmptyThread`'s heading rendering as a `<p>` (mirrors existing `CardTitle` convention).

Full detail for every item, including exact `file:line` references, is in `issues/5/review-findings.json`.

### Implement test results (cited, not re-run)
Per `implement-handoff.md`: `pnpm test` — 24 files / 156 tests passed (~11s); `pnpm typecheck` clean; `pnpm lint` clean; `pnpm build` (tsup: ESM+CJS+d.ts+styles.css+fonts) succeeds; `pnpm build-storybook` succeeds for all 24 story files (one informational, pre-existing Vite chunk-size warning noted as benign). A benign KaTeX `strict:"warn"` console warning in two `MathBlock` tests is noted as cosmetic, not a failure.

### Gaps in test coverage
- No test pins `MessageBubble`'s rendered width for short content — jsdom performs no layout, so the box-model bug (finding 1) is invisible to the existing RTL suite; this is a real coverage gap, not just a CSS-review nit, since nothing would catch a regression here either way.
- No test exercises a code span nested inside a list item or blockquote in `Markdown`, and no test asserts the GFM table wrapper carries `overflow-x-auto` — the exact edge cases the implementer flagged as needing review; code trace shows current behavior is correct but nothing pins it against future regression.
- No test distinguishes `AttachmentCard`'s "remove" vs. "retry" behavior beyond label text.

### Tests/build in review
- **Not run** — review is diff + code reading only; implement phase owns execution (see cited results above).

## Principles review

### Summary
This is a large, well-organized PR (22 new components across 8 mockup sections, ~6200 lines) that is broadly consistent in convention: every reviewed component uses the shared `cx()` helper, avoids inline styles except one justified dynamic-indentation case, has no JS theme branching, and shows no XSS/HTML-injection surface despite adding a full markdown-rendering pipeline for the first time. Test coverage is comprehensive and behavior-focused. Against that quality bar, the issues found are concentrated: one genuine, unflagged visual bug in the most fundamental component (`MessageBubble`), one accessibility gap in an interactive overlay (`Lightbox`), and a cluster of minor consistency/edge-case gaps — several of which the implementer had already surfaced as open questions.

### Critical (must fix)
- `src/components/MessageBubble/MessageBubble.tsx` — add `w-fit` (or equivalent) to the outer wrapper so short messages shrink-wrap instead of stretching to the `max-w` cap. This is the primary, most-repeated component in any real thread; the current behavior contradicts both the mockup's chat-bubble convention and the component's own story description.

### Suggestions (should consider)
- `src/components/Lightbox/Lightbox.tsx` — add a focus trap (move focus into the dialog on open, cycle `Tab`/`Shift+Tab` within it, restore focus to the trigger on close), or drop `aria-modal="true"` if that's out of scope for this pass.
- `src/components/JsonViewer/JsonViewer.tsx` — wrap in `overflow-x-auto` to match the convention every sibling component follows.
- `src/components/ToolCallCard/ToolCallCard.tsx` — fallback text (e.g. "Unknown error") when `error` is omitted on a failed call.
- `src/components/Citation/Citation.tsx`, `src/components/WebSearchCard/WebSearchCard.tsx` — validate `http(s):` scheme before rendering a source URL as a link.

### Nice to have
- Share the `Chevron` icon (`ThinkingBlock`/`ToolCallCard`/`JsonViewer`) and the `hostname()` helper (`Citation`/`WebSearchCard`) instead of duplicating them.
- Redefine the new `-300`/`accent2-400` status-color tokens under `[data-theme="light"]` (pre-existing gap, now touched by more surfaces).
- Fix header-truncation CSS in `CodeBlock`/`DiffBlock` filename spans (missing `min-w-0 flex-1`/block display).

### Scenario overlap avoided
Component-level state-machine correctness (`Composer`, `ArtifactPanel`, `ThinkingBlock`/`ToolCallCard` collapse-expand), event-listener cleanup (`VideoEmbed`, `Lightbox`), and the `ImageGrid` overflow formula were all verified once each above and are not re-derived here — see "Scenarios verified".

### Principles applied
Security (raw-HTML/XSS surface via the new markdown pipeline, `dangerouslySetInnerHTML` sinks, link-scheme handling), accessibility (focus management, `aria-*` correctness, contrast), maintainability (duplication, convention consistency with `cx()` and the existing `HTMLAttributes`-extension pattern), and design fidelity against the requirements/mockup description in `language.md`.

## Recommendation
Not yet mergeable as-is: the `MessageBubble` sizing bug is a real, visible defect in the highest-traffic component and should be fixed before merge. Everything else here — the `Lightbox` focus-trap gap and the minor/note items — is reasonable to land now or as fast, targeted follow-ups; none of them block on their own. Once `MessageBubble` is fixed, this is close to ship-ready.
