# Requirements: issue-8

## Original ask
### Problem

There is no full end to end demo of the chat 

### Proposed solution

In storybook create a full demo of the chat with mock responses. Demonstrate all possible components, let users know what they can type to see the different components with hardcoded answers.

### Acceptance criteria

- [ ] full example of chat exists
- [ ]

## Clarifications
| # | Question | Answer | Recommended |
|---|----------|--------|-------------|
| 1 | Should the full demo be a new, self-contained interactive component (own local React state, real send/receive loop off `Composer`, keyword-matched mock responses) living Storybook-only and *not* exported from `src/index.ts` (e.g. `src/demo/ChatDemo.tsx` + `.stories.tsx`, under a `Demo/`/`Examples/` category)? | Yes | Yes |
| 2 | Cover all 24 components as demo triggers, or just the chat-facing/showcase set (skip `Button`/`Card` structural primitives)? | Showcase set only | Showcase set only |
| 3 | How should users discover what to type — `EmptyThread` suggestions only, static docs list only, an in-chat `help` keyword only, or a mix? | Both — `EmptyThread` suggestions for a few highlights plus a `help` keyword that lists every trigger in-chat | Both |
| 4 | Should mock responses simulate real streaming (generating state, delay, optional `ThinkingBlock`, streaming caret) or render instantly? | Simulate it | Simulate it |
| 5 | Test coverage for `ChatDemo` — full per-trigger TDD coverage, a light smoke test, or no dedicated test file? | No need to test it | Full per-trigger TDD coverage |
| 6 | Unmatched input fallback, and should there be a reset/clear-conversation control? | Agreed with recommendation: friendly fallback `AssistantMessage` nudging toward `help`; yes to a reset control | Friendly fallback + reset control |
| 7 | Should triggering `ArtifactPanel` open the real split-view layout (thread narrows, panel appears, closable) or render inline/unopened like other components? | Agreed — open the real split-view layout | Open the real split-view layout |
| 8 | Should the demo have a `Mobile` viewport story variant, matching repo convention, or is a single default story enough? | Skip mobile | Skip mobile — coverage, not responsive layout, is the point |

## Acceptance criteria
- [ ] A new interactive `ChatDemo` component + Storybook story exists, not exported from the library's `src/index.ts`
- [ ] Demo triggers cover the chat-facing showcase set (`MessageBubble`, `AssistantMessage`, `ErrorMessage`, `EmptyThread`, `ThinkingBlock`, `ToolCallCard`, `Markdown`, `CodeBlock`, `DiffBlock`, `JsonViewer`, `MathBlock`, `ImagePreview`, `ImageGrid`, `Lightbox`, `VideoEmbed`, `AttachmentCard`, `Citation`, `WebSearchCard`, `Chart`, `SuggestedFollowUps`, `ArtifactPanel`, `Composer`) — `Button`/`Card` excluded as standalone triggers
- [ ] Demo starts on `EmptyThread` with a handful of highlight suggestions (clicking sends them)
- [ ] A `help` keyword returns an `AssistantMessage` listing every available trigger keyword
- [ ] Sending a message shows `Composer`'s `generating` state and a brief simulated delay before the response renders (with `streaming` caret / `ThinkingBlock` used where relevant) rather than responding instantly
- [ ] No dedicated `ChatDemo.test.tsx` — per human's clarify answer, this demo ships without its own test file (existing per-component tests are untouched)
- [ ] Unmatched input renders a friendly fallback `AssistantMessage` pointing to `help`
- [ ] A reset/clear-conversation control returns the demo to its initial `EmptyThread` state
- [ ] Triggering `ArtifactPanel` opens the real split-view layout (thread narrows, panel appears, with a close control back to normal width)
- [ ] No `Mobile` viewport story variant for this issue (single default-viewport story is sufficient)

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
