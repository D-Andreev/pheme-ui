import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MathBlock } from "./MathBlock";

describe("MathBlock", () => {
  it("renders KaTeX output for valid inline math", () => {
    const { container } = render(<MathBlock math="E = mc^2" />);
    expect(container.querySelector(".katex")).toBeInTheDocument();
    expect(container.querySelector(".katex-error")).not.toBeInTheDocument();
  });

  it("renders inline math in a span with no block wrapper margins", () => {
    const { container } = render(<MathBlock math="x^2" />);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(container.querySelector("div")).not.toBeInTheDocument();
  });

  it("renders KaTeX output for valid block/display math with the display wrapper", () => {
    const { container } = render(
      <MathBlock math="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" display />,
    );
    expect(container.querySelector(".katex-display")).toBeInTheDocument();
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain("overflow-x-auto");
  });

  it("does not throw and shows a visible fallback for invalid LaTeX", () => {
    expect(() => render(<MathBlock math="\\frac{1}{" display />)).not.toThrow();
    const { container } = render(<MathBlock math="\\frac{1}{" display />);
    const errorIndicator =
      container.querySelector(".katex-error") ?? container.querySelector(".text-danger");
    expect(errorIndicator).toBeTruthy();
    expect(container.textContent).not.toBe("");
  });

  it("merges a custom className onto the root element", () => {
    const { container } = render(<MathBlock math="x" className="custom-class" />);
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
