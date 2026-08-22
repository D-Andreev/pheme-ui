import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssistantMessage } from "./AssistantMessage";

describe("AssistantMessage", () => {
  it("renders markdown content", () => {
    render(<AssistantMessage content={"## Hello world\n\nSome body text."} />);
    expect(screen.getByRole("heading", { name: "Hello world" })).toBeInTheDocument();
    expect(screen.getByText("Some body text.")).toBeInTheDocument();
  });

  it("shows the streaming caret when streaming", () => {
    render(<AssistantMessage content="Still going" streaming />);
    expect(screen.getByTestId("streaming-caret")).toBeInTheDocument();
  });

  it("does not show the streaming caret when not streaming", () => {
    render(<AssistantMessage content="Done" />);
    expect(screen.queryByTestId("streaming-caret")).not.toBeInTheDocument();
  });

  it("renders one button per action and fires each action's own onClick", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const onRetry = vi.fn();
    render(
      <AssistantMessage
        content="Response with actions"
        actions={[
          { label: "Copy", onClick: onCopy },
          { label: "Retry", onClick: onRetry },
        ]}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledOnce();
    expect(onRetry).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("still renders the reserved-height actions wrapper when there are no actions", () => {
    render(<AssistantMessage content="No actions yet" />);
    const wrapper = screen.getByTestId("assistant-message-actions");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("min-h-9");
    expect(wrapper.children).toHaveLength(0);
  });

  it("is keyboard focusable", () => {
    const { container } = render(<AssistantMessage content="Focus me" />);
    expect(container.firstElementChild).toHaveAttribute("tabindex", "0");
  });
});
