import type { Meta, StoryObj } from "@storybook/react";
import { JsonViewer } from "./JsonViewer";

const meta = {
  title: "Components/JsonViewer",
  component: JsonViewer,
  tags: ["autodocs"],
} satisfies Meta<typeof JsonViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

const nestedObject = {
  id: "msg_01abc",
  role: "assistant",
  streaming: false,
  tokens: 128,
  metadata: {
    model: "claude",
    temperature: 0.7,
    tags: ["chat", "tool-call"],
    parent: null,
  },
};

const arrayOfObjects = [
  { name: "search_web", status: "success", durationMs: 214 },
  { name: "read_file", status: "error", durationMs: 12 },
  { name: "write_file", status: "success", durationMs: 88 },
];

const deeplyNested = {
  a: { b: { c: { d: { value: "deep", count: 4 } } } },
};

export const NestedObject: Story = {
  args: {
    name: "result",
    data: nestedObject,
  },
};

export const ArrayOfObjects: Story = {
  args: {
    name: "toolCalls",
    data: arrayOfObjects,
  },
};

export const AllExpanded: Story = {
  args: {
    name: "result",
    data: nestedObject,
    defaultExpanded: true,
  },
};

export const RootOnlyExpanded: Story = {
  args: {
    name: "result",
    data: nestedObject,
    defaultExpanded: false,
  },
};

export const ExpandedTwoLevels: Story = {
  args: {
    name: "result",
    data: deeplyNested,
    defaultExpanded: 2,
  },
};

export const Mobile: Story = {
  args: {
    name: "toolCalls",
    data: arrayOfObjects,
    defaultExpanded: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
