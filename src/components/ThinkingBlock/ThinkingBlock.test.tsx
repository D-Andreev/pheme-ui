import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThinkingBlock } from "./ThinkingBlock";

describe("ThinkingBlock", () => {
  it("renders collapsed by default, hiding content from the DOM", () => {
    render(<ThinkingBlock content="Some reasoning text" />);
    const toggle = screen.getByRole("button", { name: /thought process/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Some reasoning text")).not.toBeInTheDocument();
  });

  it("expands to show content when toggled, and collapses again on a second toggle", async () => {
    const user = userEvent.setup();
    render(<ThinkingBlock content="Some reasoning text" />);
    const toggle = screen.getByRole("button", { name: /thought process/i });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Some reasoning text")).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Some reasoning text")).not.toBeInTheDocument();
  });

  it("respects defaultExpanded", () => {
    render(<ThinkingBlock content="Visible from the start" defaultExpanded />);
    expect(screen.getByText("Visible from the start")).toBeInTheDocument();
  });

  it("shows the 'Thinking…' label and pulsing indicator while streaming", () => {
    render(<ThinkingBlock content="…" streaming />);
    expect(screen.getByRole("button", { name: /thinking/i })).toBeInTheDocument();
    expect(screen.getByTestId("thinking-streaming-indicator")).toBeInTheDocument();
  });

  it("does not show the streaming indicator when not streaming", () => {
    render(<ThinkingBlock content="Done thinking" />);
    expect(screen.getByRole("button", { name: /thought process/i })).toBeInTheDocument();
    expect(screen.queryByTestId("thinking-streaming-indicator")).not.toBeInTheDocument();
  });
});
