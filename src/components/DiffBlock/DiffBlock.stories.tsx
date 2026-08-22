import type { Meta, StoryObj } from "@storybook/react";
import { DiffBlock } from "./DiffBlock";

const meta = {
  title: "Components/DiffBlock",
  component: DiffBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof DiffBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddedOnly: Story = {
  args: {
    diff: `+export function greet(name: string): string {
+  return \`Hello, \${name}!\`;
+}`,
  },
};

export const RemovedOnly: Story = {
  args: {
    diff: `-export function greet(name) {
-  return "Hello, " + name;
-}`,
  },
};

export const MixedWithHunkHeader: Story = {
  args: {
    diff: `@@ -1,5 +1,5 @@
 export function greet(name) {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }`,
  },
};

export const WithFilename: Story = {
  args: {
    filename: "greet.ts",
    diff: `--- a/greet.ts
+++ b/greet.ts
@@ -1,5 +1,5 @@
 export function greet(name) {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }`,
  },
};

export const Mobile: Story = {
  args: {
    filename: "greet.ts",
    diff: `@@ -1,5 +1,5 @@
 export function greet(name) {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }`,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
