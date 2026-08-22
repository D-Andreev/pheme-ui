import type { Meta, StoryObj } from "@storybook/react";
import { ToolCallCard } from "./ToolCallCard";

const meta = {
  title: "Components/ToolCallCard",
  component: ToolCallCard,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["running", "success", "failed"],
    },
  },
} satisfies Meta<typeof ToolCallCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    name: "search_files",
    args: { query: "pheme-ui tokens", path: "src/styles" },
    status: "running",
    defaultExpanded: true,
  },
};

export const SuccessCollapsed: Story = {
  args: {
    name: "search_files",
    args: { query: "pheme-ui tokens", path: "src/styles" },
    status: "success",
    result: { matches: 2, files: ["tokens.css", "tailwind.config.js"] },
  },
};

export const SuccessExpanded: Story = {
  args: {
    name: "search_files",
    args: { query: "pheme-ui tokens", path: "src/styles" },
    status: "success",
    result: { matches: 2, files: ["tokens.css", "tailwind.config.js"] },
    defaultExpanded: true,
  },
};

export const Failed: Story = {
  args: {
    name: "run_shell",
    args: { command: "pnpm test -- --broken-flag" },
    status: "failed",
    error: "Unknown option '--broken-flag'",
    defaultExpanded: true,
  },
};

export const Mobile: Story = {
  args: {
    name: "search_files",
    args: { query: "pheme-ui tokens", path: "src/styles" },
    status: "success",
    result: { matches: 2, files: ["tokens.css", "tailwind.config.js"] },
    defaultExpanded: true,
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
