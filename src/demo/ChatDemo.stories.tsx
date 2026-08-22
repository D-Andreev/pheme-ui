import type { Meta, StoryObj } from "@storybook/react";
import { ChatDemo } from "./ChatDemo";

const meta = {
  title: "Demo/ChatDemo",
  component: ChatDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "End-to-end demo of the chat, wiring the full showcase set into one live send/receive loop. " +
          "Type `help` in the running demo to see every trigger keyword, or click a suggestion on the " +
          "empty state to get started.",
      },
    },
  },
} satisfies Meta<typeof ChatDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
