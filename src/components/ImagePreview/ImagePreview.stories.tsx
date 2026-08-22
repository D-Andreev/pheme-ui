import type { Meta, StoryObj } from "@storybook/react";
import { ImagePreview } from "./ImagePreview";

const SAMPLE_SRC = "https://picsum.photos/seed/pheme-1/640/360";

const meta = {
  title: "Components/ImagePreview",
  component: ImagePreview,
  tags: ["autodocs"],
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "A generated landscape",
  },
};

export const Loading: Story = {
  args: {
    src: SAMPLE_SRC,
    loading: true,
  },
};

export const WithHoverActions: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "A generated landscape",
    onExpand: () => {},
    onDownload: () => {},
  },
};

export const Mobile: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "A generated landscape",
    onExpand: () => {},
    onDownload: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
