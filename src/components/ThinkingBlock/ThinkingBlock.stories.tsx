import type { Meta, StoryObj } from "@storybook/react";
import { ThinkingBlock } from "./ThinkingBlock";

const sampleContent =
  "The user wants a summary of the quarterly report. Let me check the key " +
  "metrics first: revenue is up 12% quarter-over-quarter, driven mostly by " +
  "the new enterprise tier. I should call out churn separately since it " +
  "moved in the opposite direction.";

const meta = {
  title: "Components/ThinkingBlock",
  component: ThinkingBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof ThinkingBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    content: sampleContent,
  },
};

export const Expanded: Story = {
  args: {
    content: sampleContent,
    defaultExpanded: true,
  },
};

export const Streaming: Story = {
  args: {
    content: sampleContent,
    streaming: true,
    defaultExpanded: true,
  },
};

export const Mobile: Story = {
  args: {
    content: sampleContent,
    defaultExpanded: true,
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
