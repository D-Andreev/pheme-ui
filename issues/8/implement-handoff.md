# Implement Handoff: issue-8

## Summary

Built `ChatDemo`, a Storybook-only, interactive, stateful component that
wires the full chat-facing showcase set into one live send/receive loop.
Typing into `Composer` keyword-matches the message against a trigger list
and plays a simulated mock response — `generating` state, a short delay,
and (where relevant) a streaming caret / `ThinkingBlock` reveal — rather
than responding instantly. `help` lists every trigger; unmatched input
falls back to a friendly nudge toward `help`. A `Reset` control returns
the demo to its initial `EmptyThread` state, and triggering `artifact`
opens a real split-view layout (thread narrows, `ArtifactPanel` appears
with a `Close` control). Not exported from `src/index.ts`, per clarify.

## Branch

`workflow/issue-8` (base: `main`)

## Changes

- `src/demo/chatDemoTriggers.tsx` — trigger data (18 triggers covering the
  showcase set, plus a generated `help` trigger and a fallback) and
  `AssistantBlockView`, which renders each runtime block via the matching
  pheme-ui component.
- `src/demo/ChatDemo.tsx` — the stateful component: message list, keyword
  matcher, the turn-playing engine (staleness-guarded so a `Reset` mid-turn
  can't leak stray updates), artifact-panel state, and lightbox state.
- `src/demo/ChatDemo.stories.tsx` — a single `Demo/ChatDemo` story
  (no `Mobile` variant, per clarify).
- `workflow/PROJECT.md` — merged issue #8's language note about `ChatDemo`
  under `## Language`.

## TDD cycles

No TDD cycles for `ChatDemo` itself — per the clarify answer to round 5,
this demo ships without its own test file, so there's no red/green cycle
to record here. Existing per-component tests were left untouched and
re-run unmodified (see Test results) to confirm nothing regressed.

## Test results

- `pnpm test` (vitest): **24 test files, 166 tests, all passing** — the
  full existing per-component suite, unmodified. No `ChatDemo.test.tsx`
  was added, matching the approved requirements.
- `pnpm typecheck` (tsc --noEmit): clean.
- `pnpm lint` (eslint .): clean.
- `pnpm build` (tsup): clean; `dist/index.*` does **not** include
  `ChatDemo` (confirms it's not reachable from `src/index.ts`).
- `pnpm build-storybook`: clean; `Demo/ChatDemo` story bundled.
- Manual runtime smoke test (Playwright against the built Storybook
  static, headless Chromium, page-error listener attached — zero page
  errors across the run): sent `help`, `thinking`, `tool`, `error` (+
  clicked Retry — same block re-shows the error, not duplicated),
  `artifact` (opened panel, toggled Preview/Code, clicked Close — panel
  actually unmounts), `images` (grid renders, clicking a tile opens the
  internal `Lightbox` as a `role="dialog"`, Escape closes it), `chart`,
  and `followups` (clicked a follow-up suggestion — correctly re-ran the
  `chart` trigger). Clicked `Reset` — thread returns to the initial
  `EmptyThread` heading with no leftover content.

## Acceptance criteria

- [x] A new interactive `ChatDemo` component + Storybook story exists,
      not exported from the library's `src/index.ts`
- [x] Demo triggers cover the chat-facing showcase set (`MessageBubble`,
      `AssistantMessage`, `ErrorMessage`, `EmptyThread`, `ThinkingBlock`,
      `ToolCallCard`, `Markdown`, `CodeBlock`, `DiffBlock`, `JsonViewer`,
      `MathBlock`, `ImagePreview`, `ImageGrid`, `Lightbox`, `VideoEmbed`,
      `AttachmentCard`, `Citation`, `WebSearchCard`, `Chart`,
      `SuggestedFollowUps`, `ArtifactPanel`, `Composer`) — `Button`/`Card`
      excluded as standalone triggers (still used structurally throughout)
- [x] Demo starts on `EmptyThread` with a handful of highlight suggestions
      (clicking sends them)
- [x] A `help` keyword returns an `AssistantMessage` listing every
      available trigger keyword
- [x] Sending a message shows `Composer`'s `generating` state and a brief
      simulated delay before the response renders (streaming caret /
      `ThinkingBlock` used where relevant) rather than responding instantly
- [x] No dedicated `ChatDemo.test.tsx` — ships without its own test file;
      existing per-component tests are untouched and pass
- [x] Unmatched input renders a friendly fallback `AssistantMessage`
      pointing to `help`
- [x] A reset/clear-conversation control returns the demo to its initial
      `EmptyThread` state
- [x] Triggering `ArtifactPanel` opens the real split-view layout (thread
      narrows, panel appears, with a close control back to normal width)
- [x] No `Mobile` viewport story variant for this issue

## Suggested review scenarios

1. Open `Demo/ChatDemo` in Storybook. Confirm the empty state shows the
   heading and four highlight suggestions, and that clicking one sends it.
2. Type `help` — confirm every trigger keyword below is listed and the
   list matches `TRIGGERS` in `chatDemoTriggers.tsx`.
3. Send `thinking` — confirm a `ThinkingBlock` appears with a streaming
   label before the follow-up `AssistantMessage` lands.
4. Send `tool` — confirm the `ToolCallCard` starts in a running state and
   flips to success with a result after a short delay.
5. Send `error`, then click **Retry** on the `ErrorMessage` — confirm the
   same block re-plays in place (no duplicate error message).
6. Send `artifact` — confirm the thread narrows and `ArtifactPanel`
   appears; toggle Preview/Code; click **Close** and confirm the panel and
   its toggle buttons are gone.
7. Send `images` — confirm the `ImageGrid` renders and clicking a tile
   opens its internal `Lightbox`; Escape closes it.
8. Send `followups`, then click one of the `SuggestedFollowUps` buttons —
   confirm it plays that trigger as if typed.
9. Send something unmatched (e.g. `asdf`) — confirm the friendly fallback
   pointing to `help` appears.
10. Click **Reset** mid-conversation (including once while a response is
    still generating) — confirm the thread returns cleanly to the initial
    `EmptyThread` state with no stray in-flight updates landing afterward.
11. Confirm `ChatDemo` is not importable from the package's public entry
    (`src/index.ts` has no `./demo` export) and that `pnpm build`'s
    `dist/` output doesn't include it.
