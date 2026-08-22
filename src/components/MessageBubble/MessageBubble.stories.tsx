import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "./MessageBubble";

const meta = {
  title: "Components/MessageBubble",
  component: MessageBubble,
  tags: ["autodocs"],
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "What's the difference between a Card and a MessageBubble?",
  },
};

export const Editable: Story = {
  args: {
    content: "Can you rewrite this in a more casual tone?",
    editable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover (or Tab to focus) the bubble to reveal the edit action, positioned to its left.",
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    content:
      "Here's a much longer message to demonstrate wrapping behavior: I want to make sure that " +
      "the bubble constrains itself to a reasonable maximum width instead of stretching edge to " +
      "edge, so long paragraphs of user input wrap naturally onto multiple lines while staying " +
      "readable and right-aligned within the thread.",
  },
};

export const Mobile: Story = {
  args: {
    content: "How does this look on a narrow viewport?",
    editable: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
