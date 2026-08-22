import type { Meta, StoryObj } from "@storybook/react";
import { WebSearchCard } from "./WebSearchCard";

const results = [
  {
    title: "Nocturne design system — overview",
    url: "https://pheme.example.com/docs/nocturne",
    snippet: "A dark-first design system for chat interfaces, with tokens for color, spacing, and motion.",
  },
  {
    title: "Building accessible chat UIs",
    url: "https://developer.example.com/articles/accessible-chat",
    snippet: "Patterns for keyboard navigation, focus management, and screen-reader support in chat products.",
  },
  {
    title: "Inline citations in AI answers",
    url: "https://research.example.org/papers/inline-citations",
    snippet: "A survey of UI patterns for grounding generated text in retrieved sources.",
  },
];

const meta = {
  title: "Components/WebSearchCard",
  component: WebSearchCard,
  tags: ["autodocs"],
} satisfies Meta<typeof WebSearchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    query: "nocturne design system chat components",
    results,
  },
};

export const Mobile: Story = {
  args: {
    query: "nocturne design system chat components",
    results,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
