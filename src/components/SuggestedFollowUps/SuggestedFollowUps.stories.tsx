import type { Meta, StoryObj } from "@storybook/react";
import { SuggestedFollowUps } from "./SuggestedFollowUps";

const suggestions = [
  "What are the tradeoffs?",
  "Can you show an example?",
  "How does this compare to the alternative?",
];

const meta = {
  title: "Components/SuggestedFollowUps",
  component: SuggestedFollowUps,
  tags: ["autodocs"],
} satisfies Meta<typeof SuggestedFollowUps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    suggestions,
  },
};

export const Empty: Story = {
  args: {
    suggestions: [],
  },
};

export const Mobile: Story = {
  args: {
    suggestions,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
