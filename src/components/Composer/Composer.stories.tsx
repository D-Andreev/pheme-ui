import type { Meta, StoryObj } from "@storybook/react";
import { Composer } from "./Composer";
import type { ComposerAttachment } from "./Composer";

const meta = {
  title: "Components/Composer",
  component: Composer,
  tags: ["autodocs"],
  args: {
    value: "",
    onChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: "",
  },
};

/**
 * Storybook cannot force `:focus-within` via args — this story renders the
 * default composer; click into the textarea in the canvas to see the focus
 * ring (`focus-within:ring-1 focus-within:ring-accent`) the root applies
 * when the textarea gains focus.
 */
export const Focus: Story = {
  args: {
    value: "",
    placeholder: "Click into the textarea to see the focus ring",
  },
};

const sampleAttachments: ComposerAttachment[] = [
  { id: "1", filename: "quarterly-report.pdf" },
  { id: "2", filename: "screenshot.png" },
  { id: "3", filename: "notes.txt" },
];

export const Attachments: Story = {
  args: {
    value: "",
    attachments: sampleAttachments,
    onRemoveAttachment: () => {},
  },
};

export const Generating: Story = {
  args: {
    value: "Tell me about the Nocturne design system",
    generating: true,
  },
};

export const OverLimit: Story = {
  args: {
    value:
      "This message is way too long for the configured max length and should trip the danger state.",
    maxLength: 40,
  },
};

export const Mobile: Story = {
  args: {
    value: "",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
