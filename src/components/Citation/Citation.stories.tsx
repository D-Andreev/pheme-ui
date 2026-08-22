import type { Meta, StoryObj } from "@storybook/react";
import { SourceList } from "./Citation";

const sources = [
  { index: 1, title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
  { index: 2, title: "The Nocturne Design System", url: "https://pheme.example.com/docs/nocturne" },
  { index: 3, title: "React Docs — forwardRef", url: "https://react.dev/reference/react/forwardRef" },
];

const meta = {
  title: "Components/Citation",
  component: SourceList,
  tags: ["autodocs"],
} satisfies Meta<typeof SourceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sources,
  },
};

export const Mobile: Story = {
  args: {
    sources,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
