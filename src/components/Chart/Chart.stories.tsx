import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "./Chart";

const data = [
  { label: "Mon", a: 12, b: 18 },
  { label: "Tue", a: 20, b: 14 },
  { label: "Wed", a: 8, b: 26 },
  { label: "Thu", a: 24, b: 22 },
  { label: "Fri", a: 16, b: 30 },
];

const meta = {
  title: "Components/Chart",
  component: Chart,
  tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data,
    seriesLabels: ["Baseline", "This week"],
  },
};

export const SinglePoint: Story = {
  args: {
    data: [{ label: "Today", a: 5, b: 9 }],
  },
};

export const Mobile: Story = {
  args: {
    data,
    seriesLabels: ["Baseline", "This week"],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
