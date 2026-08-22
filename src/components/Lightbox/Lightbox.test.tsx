import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lightbox } from "./Lightbox";

const IMAGES = [
  { src: "https://example.com/1.png", alt: "First" },
  { src: "https://example.com/2.png", alt: "Second" },
  { src: "https://example.com/3.png", alt: "Third" },
];

describe("Lightbox", () => {
  it("renders the image at the given index", () => {
    render(<Lightbox images={IMAGES} index={1} onClose={vi.fn()} onNavigate={vi.fn()} />);
    const img = screen.getByRole("img", { name: "Second" });
    expect(img).toHaveAttribute("src", IMAGES[1]!.src);
  });

  it("wraps to the last image when clicking prev from index 0", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Lightbox images={IMAGES} index={0} onClose={vi.fn()} onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  it("wraps to the first image when clicking next from the last index", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Lightbox images={IMAGES} index={2} onClose={vi.fn()} onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Lightbox images={IMAGES} index={0} onClose={onClose} onNavigate={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("navigates with ArrowRight and ArrowLeft, and closes with Escape", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    render(<Lightbox images={IMAGES} index={1} onClose={onClose} onNavigate={onNavigate} />);

    await user.keyboard("{ArrowRight}");
    expect(onNavigate).toHaveBeenLastCalledWith(2);

    await user.keyboard("{ArrowLeft}");
    expect(onNavigate).toHaveBeenLastCalledWith(0);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("acts on the current index for repeated key presses, not a stale closure", async () => {
    const onNavigate = vi.fn();
    const { rerender } = render(<Lightbox images={IMAGES} index={0} onClose={vi.fn()} onNavigate={onNavigate} />);

    // Simulate the parent updating `index` in response to the first navigation.
    rerender(<Lightbox images={IMAGES} index={2} onClose={vi.fn()} onNavigate={onNavigate} />);

    await userEvent.setup().keyboard("{ArrowRight}");
    expect(onNavigate).toHaveBeenLastCalledWith(0);
  });

  it("does not render prev/next buttons with a single image", () => {
    render(<Lightbox images={[IMAGES[0]!]} index={0} onClose={vi.fn()} onNavigate={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Previous image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
  });

  it("moves focus into the dialog on open and restores it to the trigger on close", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open lightbox";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { unmount } = render(
      <Lightbox images={IMAGES} index={0} onClose={vi.fn()} onNavigate={vi.fn()} />,
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));

    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("traps Tab within the dialog's focusable elements", async () => {
    const user = userEvent.setup();
    render(<Lightbox images={IMAGES} index={1} onClose={vi.fn()} onNavigate={vi.fn()} />);

    const close = screen.getByRole("button", { name: "Close" });
    const prev = screen.getByRole("button", { name: "Previous image" });
    const next = screen.getByRole("button", { name: "Next image" });

    expect(document.activeElement).toBe(close);

    await user.tab();
    expect(document.activeElement).toBe(prev);
    await user.tab();
    expect(document.activeElement).toBe(next);
    // Wraps back to the first focusable element instead of leaving the dialog.
    await user.tab();
    expect(document.activeElement).toBe(close);

    // Shift+Tab from the first element wraps to the last.
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(next);
  });
});
