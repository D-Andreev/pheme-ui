import type { Meta, StoryObj } from "@storybook/react";
import { VideoEmbed } from "./VideoEmbed";

const meta = {
  title: "Components/VideoEmbed",
  component: VideoEmbed,
  tags: ["autodocs"],
} satisfies Meta<typeof VideoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSrc =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const samplePoster =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower-poster.jpg";

export const Default: Story = {
  args: {
    src: sampleSrc,
    poster: samplePoster,
  },
};

export const Mobile: Story = {
  args: {
    src: sampleSrc,
    poster: samplePoster,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
