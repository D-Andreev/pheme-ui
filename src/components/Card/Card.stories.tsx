import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardTitle } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    elevation: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    elevation: "sm",
    children: (
      <>
        <CardTitle>Assistant</CardTitle>
        <CardBody>
          Structural shell only — this is the surface a message bubble will
          eventually render on, not a chat implementation.
        </CardBody>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    elevation: "lg",
    children: (
      <>
        <CardTitle>Assistant</CardTitle>
        <CardBody>Same shell at the highest elevation token.</CardBody>
      </>
    ),
  },
};

/**
 * Passing `onClick` switches on the interactive treatment (issue #10):
 * hover/focus/press micro-interactions, a pointer cursor, keyboard
 * activation (Enter/Space), and `role="button"` — verify by hovering,
 * tabbing to it, and pressing it, plus toggling OS-level reduced-motion to
 * confirm the scale animation drops out.
 */
export const Clickable: Story = {
  args: {
    elevation: "sm",
    onClick: () => alert("Card activated"),
    children: (
      <>
        <CardTitle>Pick a workspace</CardTitle>
        <CardBody>Hover, focus, or press — the whole card responds.</CardBody>
      </>
    ),
  },
};
