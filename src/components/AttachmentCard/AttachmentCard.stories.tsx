import type { Meta, StoryObj } from "@storybook/react";
import { AttachmentCard } from "./AttachmentCard";

const meta = {
  title: "Components/AttachmentCard",
  component: AttachmentCard,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["uploading", "success", "error"],
    },
  },
} satisfies Meta<typeof AttachmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploading: Story = {
  args: {
    filename: "quarterly-report.pdf",
    size: "4.1 MB",
    status: "uploading",
    progress: 62,
    onRemove: () => {},
  },
};

export const Success: Story = {
  args: {
    filename: "design-spec.fig",
    size: "820 KB",
    status: "success",
    onRemove: () => {},
  },
};

export const Error: Story = {
  args: {
    filename: "video-export-final-v3-really-final.mov",
    size: "128 MB",
    status: "error",
    errorMessage: "Upload failed — file exceeds the 100 MB limit.",
    onRemove: () => {},
    onRetry: () => {},
  },
};

export const Mobile: Story = {
  args: {
    filename: "quarterly-report-with-a-very-long-filename.pdf",
    size: "4.1 MB",
    status: "uploading",
    progress: 40,
    onRemove: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
