import type { Meta, StoryObj } from "@storybook/react";
import { EmptyThread } from "./EmptyThread";

const meta = {
  title: "Components/EmptyThread",
  component: EmptyThread,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSuggestions: Story = {
  args: {
    suggestions: [
      "Summarize this document",
      "Write a unit test",
      "Explain this error message",
    ],
  },
};

export const CustomHeading: Story = {
  args: {
    heading: "Ask Pheme anything",
  },
};

export const Mobile: Story = {
  args: {
    suggestions: [
      "Summarize this document",
      "Write a unit test",
      "Explain this error message",
    ],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
