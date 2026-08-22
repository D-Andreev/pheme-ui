import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Citation, SourceList } from "./Citation";

describe("Citation", () => {
  it("renders the index", () => {
    render(<Citation index={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onClick when provided and clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Citation index={1} onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "1" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders as non-interactive when no onClick is given", () => {
    render(<Citation index={2} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("2").tagName).toBe("SPAN");
  });
});

describe("SourceList", () => {
  const sources = [
    { index: 1, title: "First Source", url: "https://example.com/a" },
    { index: 2, title: "Second Source", url: "https://another.example.org/b" },
    { index: 3, title: "Third Source", url: "https://third.example.net/c" },
  ];

  it("renders each source's title and url", () => {
    render(<SourceList sources={sources} />);
    for (const source of sources) {
      expect(screen.getByText(source.title)).toBeInTheDocument();
      expect(screen.getByText(source.title)).toHaveAttribute("href", source.url);
    }
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("another.example.org")).toBeInTheDocument();
    expect(screen.getByText("third.example.net")).toBeInTheDocument();
  });

  it("renders sources.length - 1 dividers", () => {
    const { container } = render(<SourceList sources={sources} />);
    expect(container.querySelectorAll(".hr")).toHaveLength(sources.length - 1);
  });

  it("renders no dividers for a single source", () => {
    const single = [{ index: 1, title: "Only Source", url: "https://example.com/only" }];
    const { container } = render(<SourceList sources={single} />);
    expect(container.querySelectorAll(".hr")).toHaveLength(0);
  });
});
