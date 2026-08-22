import type { Meta, StoryObj } from "@storybook/react";
import { Markdown } from "./Markdown";

const meta = {
  title: "Components/Markdown",
  component: Markdown,
  tags: ["autodocs"],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingsAndParagraph: Story = {
  args: {
    content: [
      "# Heading 1",
      "",
      "## Heading 2",
      "",
      "### Heading 3",
      "",
      "A regular paragraph of body text follows the headings, with **bold**, _italic_, and `inline code` mixed in.",
    ].join("\n"),
  },
};

export const GfmTable: Story = {
  args: {
    content: [
      "| Model | Context | Notes |",
      "| --- | --- | --- |",
      "| Sonnet | 200k | Balanced |",
      "| Opus | 200k | Highest quality |",
      "| Haiku | 200k | Fastest |",
    ].join("\n"),
  },
};

export const Lists: Story = {
  args: {
    content: [
      "Unordered:",
      "",
      "- First item",
      "- Second item",
      "- Third item",
      "",
      "Ordered:",
      "",
      "1. Step one",
      "2. Step two",
      "3. Step three",
    ].join("\n"),
  },
};

export const Blockquote: Story = {
  args: {
    content: "> This is a quoted line of text that spans a blockquote for emphasis.",
  },
};

export const FencedCodeBlock: Story = {
  args: {
    content: [
      "```typescript",
      "export function greet(name: string): string {",
      "  return `Hello, ${name}!`;",
      "}",
      "```",
    ].join("\n"),
  },
};

export const Math: Story = {
  args: {
    content: [
      "Inline math: $E=mc^2$ sits within a sentence.",
      "",
      "Block math:",
      "",
      "$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$",
    ].join("\n"),
  },
};

export const KitchenSink: Story = {
  args: {
    content: [
      "# Release Notes",
      "",
      "A summary of the change, with **bold** and _italic_ text plus `inline code`.",
      "",
      "## What changed",
      "",
      "- Added GFM table support",
      "- Added math rendering via KaTeX",
      "- Routed fenced code through `CodeBlock`",
      "",
      "## Example",
      "",
      "```typescript",
      "const total = items.reduce((sum, n) => sum + n, 0);",
      "```",
      "",
      "> Note: block math renders centered with breathing room.",
      "",
      "$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$",
      "",
      "| Metric | Before | After |",
      "| --- | --- | --- |",
      "| Latency | 120ms | 80ms |",
      "| Errors | 3% | 0.4% |",
      "",
      "---",
      "",
      "See the [project repo](https://github.com/D-Andreev/pheme-ui) for details.",
    ].join("\n"),
  },
};

export const Mobile: Story = {
  args: {
    content: [
      "| Long Column Header One | Long Column Header Two | Long Column Header Three |",
      "| --- | --- | --- |",
      "| A fairly long cell value | Another long cell value | Yet another value |",
      "| More content here | Even more content | And more still |",
    ].join("\n"),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
