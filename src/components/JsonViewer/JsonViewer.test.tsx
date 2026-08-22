import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JsonViewer } from "./JsonViewer";

describe("JsonViewer", () => {
  it("renders a root primitive value", () => {
    render(<JsonViewer name="result" data="hello" />);
    expect(screen.getByText("result:")).toBeInTheDocument();
    expect(screen.getByText('"hello"')).toBeInTheDocument();
  });

  it("renders the root value with no leading key when name is omitted", () => {
    const { container } = render(<JsonViewer data="hello" />);
    expect(screen.getByText('"hello"')).toBeInTheDocument();
    expect(container.textContent).toBe('"hello"');
  });

  it("collapses nested content by default and toggles it open/closed on click", async () => {
    const user = userEvent.setup();
    render(<JsonViewer name="result" data={{ user: { name: "Ada" } }} />);

    // Root is expanded, so the "user" key is visible…
    const userToggle = screen.getByRole("button", { name: /user/ });
    expect(userToggle).toHaveAttribute("aria-expanded", "false");

    // …but its nested children are not, until it's expanded.
    expect(screen.queryByText("name:")).not.toBeInTheDocument();
    expect(screen.queryByText('"Ada"')).not.toBeInTheDocument();

    await user.click(userToggle);
    expect(userToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("name:")).toBeInTheDocument();
    expect(screen.getByText('"Ada"')).toBeInTheDocument();

    // Clicking again collapses it back — a real toggle, not one-way.
    await user.click(userToggle);
    expect(userToggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("name:")).not.toBeInTheDocument();
    expect(screen.queryByText('"Ada"')).not.toBeInTheDocument();
  });

  it("shows a collapsed type summary for objects and arrays", () => {
    render(<JsonViewer data={{ list: [1, 2, 3], obj: { a: 1 } }} />);
    expect(screen.getByText("Array(3)")).toBeInTheDocument();
    expect(screen.getByText("{…}")).toBeInTheDocument();
  });

  it("color-codes primitive value types distinctly", () => {
    render(
      <JsonViewer
        data={{ str: "hi", num: 42, bool: true, empty: null, missing: undefined }}
        defaultExpanded
      />,
    );

    const str = screen.getByText('"hi"');
    const num = screen.getByText("42");
    const bool = screen.getByText("true");
    const nullValue = screen.getByText("null");
    const undefinedValue = screen.getByText("undefined");

    expect(str.className).toContain("text-success-300");
    expect(num.className).toContain("text-accent2-400");
    expect(bool.className).toContain("text-accent-300");
    expect(nullValue.className).toContain("text-neutral-500");
    expect(undefinedValue.className).toContain("text-neutral-500");

    // Distinct from one another.
    expect(str.className).not.toContain("text-accent2-400");
    expect(num.className).not.toContain("text-success-300");
  });

  it("renders nested content without needing a click when defaultExpanded is true", () => {
    render(
      <JsonViewer
        name="result"
        data={{ a: { b: { c: "deep value" } } }}
        defaultExpanded
      />,
    );
    expect(screen.getByText("a:")).toBeInTheDocument();
    expect(screen.getByText("b:")).toBeInTheDocument();
    expect(screen.getByText("c:")).toBeInTheDocument();
    expect(screen.getByText('"deep value"')).toBeInTheDocument();
  });

  it("expands N levels deep from the root when defaultExpanded is a number", () => {
    render(<JsonViewer data={{ a: { b: { c: "deep" } } }} defaultExpanded={2} />);
    // depth 0 (root) and depth 1 ("a") are expanded…
    expect(screen.getByText("a:")).toBeInTheDocument();
    expect(screen.getByText("b:")).toBeInTheDocument();
    // …but depth 2 ("b"'s children) is not.
    expect(screen.queryByText("c:")).not.toBeInTheDocument();
  });

  it("renders array items with index-based keys", () => {
    render(<JsonViewer data={["a", "b", "c"]} defaultExpanded />);
    expect(screen.getByText("0:")).toBeInTheDocument();
    expect(screen.getByText("1:")).toBeInTheDocument();
    expect(screen.getByText("2:")).toBeInTheDocument();
    expect(screen.getByText('"a"')).toBeInTheDocument();
    expect(screen.getByText('"c"')).toBeInTheDocument();
  });

  it("merges a custom className onto the root element", () => {
    const { container } = render(<JsonViewer data="x" className="custom-class" />);
    expect(container.firstElementChild).toHaveClass("custom-class");
    expect(container.firstElementChild).toHaveClass("font-mono");
  });

  it("scrolls its own overflow instead of breaking the parent layout", () => {
    const { container } = render(<JsonViewer data="x" />);
    expect(container.firstElementChild).toHaveClass("overflow-x-auto");
  });
});
