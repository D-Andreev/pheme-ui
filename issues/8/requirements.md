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

## Acceptance criteria
- [ ] A new interactive `ChatDemo` component + Storybook story exists, not exported from the library's `src/index.ts`

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
