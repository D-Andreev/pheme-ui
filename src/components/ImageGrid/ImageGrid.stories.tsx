import type { Meta, StoryObj } from "@storybook/react";
import { ImageGrid } from "./ImageGrid";

function makeImages(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    src: `https://picsum.photos/seed/pheme-grid-${i}/400/400`,
    alt: `Image ${i + 1}`,
  }));
}

const meta = {
  title: "Components/ImageGrid",
  component: ImageGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof ImageGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoImages: Story = {
  args: {
    images: makeImages(2),
  },
};

export const FourImages: Story = {
  args: {
    images: makeImages(4),
  },
};

export const SixImagesOverflow: Story = {
  args: {
    images: makeImages(6),
  },
};

export const Mobile: Story = {
  args: {
    images: makeImages(6),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
