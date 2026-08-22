# Review Report

**Fresh-eyes:** judgments based on artifacts and diff only (`main...HEAD` on `workflow/issue-8`; PR #9 base `f013ed3` → head `9026ec2`).

## Verdict
APPROVE WITH NOTES

## Scenario verification

### Scenarios verified

| # | Scenario | Method | Result | Notes |
|---|----------|--------|--------|-------|
| 1 | Empty state shows heading + 4 highlight suggestions; clicking one sends it | code trace | pass | `HIGHLIGHT_SUGGESTIONS` wired straight into `EmptyThread`'s `onSuggestionSelect` → `handleSend` |
| 2 | `help` lists every trigger keyword, matching `TRIGGERS` | code trace | pass | `HELP_TRIGGER` is synthesized from `TRIGGERS.map(...)`, so it can't drift out of sync |
| 3 | `thinking` shows a streaming `ThinkingBlock` before the follow-up message | code trace | pass | `streamable` flag covers `"thinking"`/`"text"`; `patchBlock` flips `streaming` false after `THINKING_REVEAL_MS` |
| 4 | `tool` starts running, flips to success with a result | code trace | pass | `toolStatus` seeded `"running"` at block creation, patched to `"success"`/`"failed"` after `TOOL_RUN_MS`; the `tool` trigger has no `error`, so it always resolves success |
| 5 | `error` + Retry re-plays in place, no duplicate message | code trace | pass | `retryTurn` calls `playTurn(trigger, turn.id)`; the `existingTurnId` branch clears `blocks: []` on the same message id instead of appending a new one |
| 6 | `artifact` narrows the thread, opens `ArtifactPanel`, Preview/Code toggle, Close removes it | code trace | pass | `onComplete` fires after the block loop finishes and calls `openArtifact`; `artifact` state gates the panel column, `Close` sets it back to `null` |
| 7 | `images` renders `ImageGrid`; clicking a tile opens its internal `Lightbox`; Escape closes | code trace | pass | `ImageGrid` is self-contained (owns its own lightbox state) — `ChatDemo`'s own `lightbox` state is only wired to the single-image `ImagePreview` case, so the two don't collide |
| 8 | `followups` → clicking a suggestion replays that trigger as if typed | code trace | pass | `SuggestedFollowUps`'s `onSelect` is wired to `onFollowUpSelect` → `handleSend`, which re-runs `matchTrigger` |
| 9 | Unmatched input renders the friendly fallback | code trace | pass | `matchTrigger(text) ?? FALLBACK_TRIGGER` — `FALLBACK_TRIGGER` has `aliases: []` so it's never matched directly, only used as the default |
| 10 | Reset mid-generation returns to `EmptyThread` cleanly, no stray updates land after | code trace | pass | `handleReset` bumps `runIdRef`; every `await` in `playTurn`'s loop is followed by an `isStale()` check comparing against the bumped `runIdRef`, so in-flight timers no-op |
| 11 | `ChatDemo` not importable from `src/index.ts`; not in `dist/` | code trace | pass | `src/index.ts` (unchanged by this PR) has no `./demo` export; nothing outside `src/demo/*` references it |

### Requirements coverage
- [x] `ChatDemo` component + story exists, not exported from `src/index.ts`
- [x] All 21 named showcase components are reachable through a trigger or composed inside one (`Button`/`Card` excluded as standalone triggers, per clarify)
- [x] `EmptyThread` start state with highlight suggestions that send on click
- [x] `help` keyword lists every trigger, generated from `TRIGGERS` (can't drift)
- [x] `generating` + simulated delay before the response renders, with streaming caret / `ThinkingBlock` where relevant
- [x] No `ChatDemo.test.tsx` — matches the explicit clarify answer
- [x] Friendly fallback pointing to `help` on unmatched input
- [x] `Reset` control, staleness-guarded against mid-turn resets
- [x] `artifact` opens the real split-view `ArtifactPanel` with a working `Close`
- [x] No `Mobile` story variant

### Issues found (from review)
- 🟡 Minor: the message list container (`ChatDemo.tsx`, the `overflow-y-auto` div) never scrolls to the latest message — a several-turn conversation leaves the newest content below the fold until the viewer scrolls manually.
- Nice to have: `Composer`'s stop control renders during `generating` but no `onStop` is passed, so — per `Composer`'s own documented behavior — it's inert; a demo visitor may click it expecting the in-flight response to stop.

### Implement test results (cited, not re-run)
- `pnpm test`: 24 files / 166 tests, all passing (existing per-component suite, unmodified — no `ChatDemo.test.tsx` added, matching the approved requirements).
- `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`: all clean per implement-handoff; `pnpm build` confirmed to exclude `ChatDemo` from `dist/`.
- Manual Playwright smoke test against the built Storybook covered `help`, `thinking`, `tool`, `error`+Retry, `artifact` open/toggle/close, `images`+Lightbox, `chart`, `followups`, and `Reset` — zero page errors.

### Gaps in test coverage
- No dedicated `ChatDemo.test.tsx` exists (by explicit clarify decision), so the staleness-guard logic (the main non-trivial piece of engineering here) and the trigger-matching table have no automated regression coverage — only the cited manual smoke pass. Acceptable per the approved requirements, but worth knowing if this component grows.

### Tests/build in review
- **Not run** — review is diff + code reading only; implement phase owns execution.

## Principles review

### Summary
`ChatDemo` and its trigger table are cleanly separated (data/rendering in `chatDemoTriggers.tsx`, state/orchestration in `ChatDemo.tsx`), every prop passed to the 21 showcase components matches that component's actual interface (`ComposerProps`, `ArtifactPanelProps`, `LightboxImage`, `ToolCallStatus`, etc. — all verified against their source), and the async turn-player is staleness-guarded correctly against a `Reset` mid-turn. No dangerous patterns (no new `dangerouslySetInnerHTML`, no unsafe URL construction) are introduced by this diff.

### Critical (must fix)
- None found.

### Suggestions (should consider)
- `src/demo/ChatDemo.tsx`: auto-scroll the thread to the latest message on new content, so a several-turn demo session doesn't require the visitor to scroll manually to see the newest response.

### Nice to have
- `src/demo/ChatDemo.tsx`: either wire a real `onStop` (even a no-op that just marks the turn as stopped) or omit the stop affordance's implied interactivity, so the button isn't a dead click during `generating`.

### Scenario overlap avoided
- Existing per-component behavior (e.g. `Lightbox` focus trap, `Composer`'s own submit/attachment logic, `ToolCallCard`'s expand/collapse) is unchanged by this PR and out of scope — reviewed only at the call-site (props passed in), not re-verified internally.

### Principles applied
- Discriminated-union block model with an explicit runtime/spec split (`AssistantBlockSpec` vs `AssistantBlock`), consistent with the rest of the library's typed-prop conventions.
- Staleness guard (`runIdRef` + `mountedRef`) is the correct pattern for cancel-in-flight-async-work-on-reset, avoiding the more common bug of a stale timer patching state after a reset.
- `help`'s list is derived from `TRIGGERS` rather than hand-duplicated, so it structurally can't go stale.

## Recommendation
Mergeable as-is — no blocking issues found; the two notes above (auto-scroll, inert stop control) are UX polish, not correctness bugs, and can be picked up in a follow-up if desired.
