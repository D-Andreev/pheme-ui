import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyThread } from "./EmptyThread";

describe("EmptyThread", () => {
  it("renders the default heading", () => {
    render(<EmptyThread />);
    expect(screen.getByText("Start a conversation")).toBeInTheDocument();
  });

  it("renders a custom heading", () => {
    render(<EmptyThread heading="Ask Pheme anything" />);
    expect(screen.getByText("Ask Pheme anything")).toBeInTheDocument();
  });

  it("renders no suggestion buttons when suggestions is empty or omitted", () => {
    render(<EmptyThread />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a button per suggestion and calls onSuggestionSelect with the right text", async () => {
    const user = userEvent.setup();
    const onSuggestionSelect = vi.fn();
    const suggestions = ["Summarize this document", "Write a unit test"];
    render(
      <EmptyThread suggestions={suggestions} onSuggestionSelect={onSuggestionSelect} />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(suggestions.length);

    await user.click(screen.getByRole("button", { name: "Write a unit test" }));
    expect(onSuggestionSelect).toHaveBeenCalledOnce();
    expect(onSuggestionSelect).toHaveBeenCalledWith("Write a unit test");
  });
});
