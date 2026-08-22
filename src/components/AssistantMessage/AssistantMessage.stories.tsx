import type { Meta, StoryObj } from "@storybook/react";
import { AssistantMessage } from "./AssistantMessage";

const sampleContent = [
  "## Here's a summary",
  "",
  "Nocturne is a **dark-first** design system with a small, consistent token set.",
  "",
  "- Colors resolve through CSS custom properties",
  "- Spacing uses the `ds-*` scale",
  "- Components stay flush with house style",
  "",
  "```ts",
  "export const answer = 42;",
  "```",
].join("\n");

const meta = {
  title: "Components/AssistantMessage",
  component: AssistantMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof AssistantMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: sampleContent,
    actions: [
      { label: "Copy", onClick: () => {} },
      { label: "Retry", onClick: () => {} },
      { label: "Good", onClick: () => {} },
      { label: "Bad", onClick: () => {} },
    ],
  },
};

export const Streaming: Story = {
  args: {
    content: "Thinking through the answer, one token at a time",
    streaming: true,
    actions: [],
  },
};

export const Complete: Story = {
  args: {
    content: "Here's the finished response, with actions available below.",
    streaming: false,
    actions: [
      { label: "Copy", onClick: () => {} },
      { label: "Retry", onClick: () => {} },
    ],
  },
};

export const NoActions: Story = {
  args: {
    content: "A response with no actions — the reserved-height row stays empty.",
    actions: [],
  },
};

export const Mobile: Story = {
  args: {
    content: sampleContent,
    actions: [
      { label: "Copy", onClick: () => {} },
      { label: "Retry", onClick: () => {} },
    ],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
