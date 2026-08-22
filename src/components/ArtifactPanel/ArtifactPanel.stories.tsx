import type { Meta, StoryObj } from "@storybook/react";
import { ArtifactPanel } from "./ArtifactPanel";

const meta = {
  title: "Components/ArtifactPanel",
  component: ArtifactPanel,
  tags: ["autodocs"],
  args: {
    title: "onboarding.md",
    mode: "preview",
    onModeChange: () => {},
    className: "h-[420px]",
  },
} satisfies Meta<typeof ArtifactPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCode = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

const previewChildren = (
  <>
    <h2 className="font-heading text-base">Generated document</h2>
    <p className="mt-ds-2 text-sm opacity-80">
      Preview content placeholder — this is where the rendered artifact body
      goes.
    </p>
  </>
);

export const Preview: Story = {
  args: {
    mode: "preview",
    children: previewChildren,
  },
};

export const Code: Story = {
  args: {
    mode: "code",
    code: sampleCode,
    language: "typescript",
  },
};

export const WithVersion: Story = {
  args: {
    mode: "preview",
    version: "v3",
    children: previewChildren,
  },
};

export const WithExport: Story = {
  args: {
    mode: "preview",
    version: "v3",
    onExport: () => {},
    children: previewChildren,
  },
};

export const WithoutExport: Story = {
  args: {
    mode: "preview",
    version: "v3",
    children: previewChildren,
  },
};

export const Mobile: Story = {
  args: {
    mode: "preview",
    version: "v3",
    children: previewChildren,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
