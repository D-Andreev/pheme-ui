import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Composer } from "./Composer";

describe("Composer", () => {
  it("renders the textarea with the placeholder and current value", () => {
    render(<Composer value="hello" onChange={() => {}} onSubmit={() => {}} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("hello");
  });

  it("calls onChange with the new value as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Composer value="" onChange={onChange} onSubmit={() => {}} />);
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "hi");
    expect(onChange).toHaveBeenCalledWith("h");
    expect(onChange).toHaveBeenCalledWith("i");
  });

  it("submits and prevents default on Enter without Shift", () => {
    const onSubmit = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSubmit={onSubmit} />);
    const textarea = screen.getByRole("textbox");
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not submit on Shift+Enter", () => {
    const onSubmit = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSubmit={onSubmit} />);
    const textarea = screen.getByRole("textbox");
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("disables the send button when value is empty or whitespace-only", () => {
    const { rerender } = render(<Composer value="" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();

    rerender(<Composer value="   " onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("enables the send button once there is non-whitespace content", () => {
    render(<Composer value="hi" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("calls onSubmit when the send button is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Composer value="hi" onChange={() => {}} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("swaps in a stop-style control and makes the textarea read-only when generating", () => {
    render(<Composer value="hi" onChange={() => {}} onSubmit={() => {}} generating />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: "Send message" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generating response" })).toBeInTheDocument();
  });

  it("renders attachment chips and calls onRemoveAttachment with the right id", async () => {
    const user = userEvent.setup();
    const onRemoveAttachment = vi.fn();
    render(
      <Composer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        attachments={[
          { id: "a1", filename: "one.pdf" },
          { id: "a2", filename: "two.png" },
        ]}
        onRemoveAttachment={onRemoveAttachment}
      />,
    );

    expect(screen.getByText("one.pdf")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove two.png" }));
    expect(onRemoveAttachment).toHaveBeenCalledWith("a2");
  });

  it("shows a danger-styled, over-limit counter and disables the send button", () => {
    render(
      <Composer value="this is too long" onChange={() => {}} onSubmit={() => {}} maxLength={5} />,
    );
    const counter = screen.getByText(
      (_, element) => element?.tagName === "SPAN" && element.textContent === "16/5",
    );
    expect(counter.className).toContain("text-danger");
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("does not call onSubmit when over the max length, via click or Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Composer
        value="this is too long"
        onChange={() => {}}
        onSubmit={onSubmit}
        maxLength={5}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSubmit).not.toHaveBeenCalled();

    const textarea = screen.getByRole("textbox");
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a muted counter under the limit", () => {
    render(<Composer value="hi" onChange={() => {}} onSubmit={() => {}} maxLength={100} />);
    const counter = screen.getByText(
      (_, element) => element?.tagName === "SPAN" && element.textContent === "2/100",
    );
    expect(counter.className).toContain("text-neutral-400");
  });
});
