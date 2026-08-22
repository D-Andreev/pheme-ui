import type { Meta, StoryObj } from "@storybook/react";
import { Lightbox } from "./Lightbox";

const IMAGES = [
  { src: "https://picsum.photos/seed/pheme-1/800/600", alt: "First image" },
  { src: "https://picsum.photos/seed/pheme-2/800/600", alt: "Second image" },
  { src: "https://picsum.photos/seed/pheme-3/800/600", alt: "Third image" },
];

const meta = {
  title: "Components/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: IMAGES,
    index: 0,
    onClose: () => {},
    onNavigate: () => {},
  },
};

export const SingleImage: Story = {
  args: {
    images: [IMAGES[0]!],
    index: 0,
    onClose: () => {},
    onNavigate: () => {},
  },
};

export const Mobile: Story = {
  args: {
    images: IMAGES,
    index: 0,
    onClose: () => {},
    onNavigate: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
