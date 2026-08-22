import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./ErrorMessage";

const meta = {
  title: "Components/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRetry: Story = {
  args: {
    message: "Something went wrong generating a response.",
    onRetry: () => {},
  },
};

export const WithoutRetry: Story = {
  args: {
    message: "This response could not be generated.",
  },
};

export const Mobile: Story = {
  args: {
    message: "Something went wrong generating a response.",
    onRetry: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
