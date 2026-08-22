import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageBubble } from "./MessageBubble";

describe("MessageBubble", () => {
  it("renders its content", () => {
    render(<MessageBubble content="Hello there" />);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("renders non-string content", () => {
    render(
      <MessageBubble
        content={
          <span>
            Rendered <strong>markdown</strong>
          </span>
        }
      />,
    );
    expect(screen.getByText("markdown")).toBeInTheDocument();
  });

  it("does not render an edit action when editable is falsy", () => {
    render(<MessageBubble content="Hello there" />);
    expect(screen.queryByRole("button", { name: "Edit message" })).not.toBeInTheDocument();
  });

  it("renders an edit action and calls onEdit when editable is true", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<MessageBubble content="Hello there" editable onEdit={onEdit} />);

    const editButton = screen.getByRole("button", { name: "Edit message" });
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
