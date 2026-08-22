import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuggestedFollowUps } from "./SuggestedFollowUps";

describe("SuggestedFollowUps", () => {
  const suggestions = ["First question?", "Second question?", "Third question?"];

  it("renders a button per suggestion", () => {
    render(<SuggestedFollowUps suggestions={suggestions} />);
    for (const suggestion of suggestions) {
      expect(screen.getByRole("button", { name: suggestion })).toBeInTheDocument();
    }
  });

  it("calls onSelect with the clicked suggestion's text", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SuggestedFollowUps suggestions={suggestions} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Second question?" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("Second question?");
  });

  it("renders no buttons for an empty array", () => {
    const { container } = render(<SuggestedFollowUps suggestions={[]} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.firstChild).toBeNull();
  });
});
