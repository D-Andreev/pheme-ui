import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const tsSnippet = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

export const Default: Story = {
  args: {
    code: tsSnippet,
    language: "typescript",
    filename: "greet.ts",
  },
};

export const NoFilename: Story = {
  args: {
    code: `def greet(name):\n    return f"Hello, {name}!"`,
    language: "python",
  },
};

export const LongLine: Story = {
  args: {
    code:
      "const url = \"https://example.com/api/v1/resource?" +
      "param1=value1&param2=value2&param3=value3&param4=value4&param5=value5&param6=value6\";",
    language: "javascript",
    filename: "request.js",
  },
};

export const UnsupportedLanguage: Story = {
  args: {
    code: "(define (square x) (* x x))",
    language: "scheme",
    filename: "square.scm",
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: tsSnippet,
    language: "typescript",
    filename: "greet.ts",
    showLineNumbers: true,
  },
};

export const Mobile: Story = {
  args: {
    code: tsSnippet,
    language: "typescript",
    filename: "greet.ts",
    showLineNumbers: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
