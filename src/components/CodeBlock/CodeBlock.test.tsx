import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders Prism-highlighted tokens for a supported language", () => {
    const { container } = render(
      <CodeBlock code="const a = 1;" language="javascript" filename="a.js" />,
    );
    expect(container.querySelector(".token")).not.toBeNull();
    expect(container.textContent).toContain("const a = 1;");
  });

  it("shows the language id in the header when no filename is given", () => {
    render(<CodeBlock code="print('hi')" language="python" />);
    expect(screen.getByText("python")).toBeInTheDocument();
  });

  it("shows the filename in the header when given", () => {
    render(<CodeBlock code="const a = 1;" language="javascript" filename="a.js" />);
    expect(screen.getByText("a.js")).toBeInTheDocument();
  });

  it("renders no header when neither filename nor language is given", () => {
    render(<CodeBlock code="plain text" />);
    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
  });

  it("renders a numbered line gutter when showLineNumbers is set", () => {
    render(<CodeBlock code={"line one\nline two\nline three"} language="javascript" showLineNumbers />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("omits the line gutter by default", () => {
    const { container } = render(<CodeBlock code={"a\nb"} language="javascript" showLineNumbers={false} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("falls back to escaped plain text for an unsupported language, without executing/injecting HTML", () => {
    const malicious = "<script>alert(1)</script>";
    const { container } = render(<CodeBlock code={malicious} language="not-a-real-language" filename="x.xyz" />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain(malicious);
  });

  it("falls back to escaped plain text when no language is given", () => {
    const malicious = "<img src=x onerror=alert(1)>";
    const { container } = render(<CodeBlock code={malicious} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain(malicious);
  });

  it("copies the code to the clipboard and shows a transient Copied label", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CodeBlock code="const a = 1;" language="javascript" filename="a.js" />);
    const button = screen.getByRole("button", { name: "Copy" });

    await act(async () => {
      fireEvent.click(button);
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith("const a = 1;");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
});
