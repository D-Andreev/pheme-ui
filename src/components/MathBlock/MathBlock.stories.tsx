import type { Meta, StoryObj } from "@storybook/react";
import { MathBlock } from "./MathBlock";

const meta = {
  title: "Components/MathBlock",
  component: MathBlock,
  tags: ["autodocs"],
  argTypes: {
    display: { control: "boolean" },
  },
} satisfies Meta<typeof MathBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    math: "E = mc^2",
    display: false,
  },
  render: (args) => (
    <p className="text-text">
      Mass-energy equivalence: <MathBlock {...args} /> is Einstein&apos;s famous equation.
    </p>
  ),
};

export const Block: Story = {
  args: {
    math: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
    display: true,
  },
};

export const InvalidLatex: Story = {
  args: {
    math: "\\frac{1}{",
    display: true,
  },
};

export const Mobile: Story = {
  args: {
    math: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\,dx = \\sqrt{\\pi} \\quad \\text{and} \\quad \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = e^x",
    display: true,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
