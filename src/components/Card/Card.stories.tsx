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
