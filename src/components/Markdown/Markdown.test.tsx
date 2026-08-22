import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown, MessageContent } from "./Markdown";

describe("Markdown", () => {
  it("renders a heading and paragraph", () => {
    render(<Markdown content={"# Title\n\nSome paragraph text."} />);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Some paragraph text.")).toBeInTheDocument();
  });

  it("exports MessageContent as an alias for Markdown", () => {
    expect(MessageContent).toBe(Markdown);
  });

  it("renders a GFM table with the right rows/cells", () => {
    const table = ["| A | B |", "| --- | --- |", "| 1 | 2 |", "| 3 | 4 |"].join("\n");
    render(<Markdown content={table} />);
    const rows = screen.getAllByRole("row");
    // header row + 2 body rows
    expect(rows).toHaveLength(3);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("cell")).toHaveLength(4);
  });

  it("renders a fenced code block through CodeBlock, not a bare <pre>", () => {
    const content = "```typescript\nconst x = 1;\n```";
    const { container } = render(<Markdown content={content} />);
    expect(container.querySelector(".pheme-code")).toBeInTheDocument();
    // CodeBlock's header shows the language and a Copy button
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("renders inline code with inline styling, not through CodeBlock", () => {
    const { container } = render(<Markdown content={"Use `const x = 1` here."} />);
    const inlineCode = screen.getByText("const x = 1");
    expect(inlineCode.tagName).toBe("CODE");
    expect(inlineCode.className).toContain("bg-code-ground");
    // Not wrapped in a CodeBlock
    expect(container.querySelector(".pheme-code")).not.toBeInTheDocument();
  });

  it("renders a blockquote", () => {
    render(<Markdown content={"> A quoted line"} />);
    expect(screen.getByText("A quoted line").closest("blockquote")).toBeInTheDocument();
  });

  it("renders an unordered and ordered list", () => {
    render(<Markdown content={"- one\n- two\n\n1. first\n2. second"} />);
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("renders inline math as KaTeX HTML", () => {
    const { container } = render(<Markdown content={"Energy: $E=mc^2$"} />);
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });

  it("renders block math as KaTeX HTML", () => {
    const { container } = render(<Markdown content={"$$\\sum_{i=1}^n i$$"} />);
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });
});
