import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageGrid } from "./ImageGrid";

function makeImages(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    src: `https://example.com/${i}.png`,
    alt: `Image ${i + 1}`,
  }));
}

describe("ImageGrid", () => {
  it("renders a tile for each image up to 4", () => {
    render(<ImageGrid images={makeImages(3)} />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("caps rendered tiles at 4 even with more images", () => {
    render(<ImageGrid images={makeImages(6)} />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("shows a +N overflow tile when there are more than 4 images", () => {
    render(<ImageGrid images={makeImages(6)} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show an overflow tile with exactly 4 images", () => {
    render(<ImageGrid images={makeImages(4)} />);
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it("calls onImageClick with the clicked tile's index and opens the internal lightbox", async () => {
    const user = userEvent.setup();
    const onImageClick = vi.fn();
    render(<ImageGrid images={makeImages(4)} onImageClick={onImageClick} />);

    await user.click(screen.getByRole("button", { name: "View image 2" }));

    expect(onImageClick).toHaveBeenCalledWith(1);
    expect(screen.getByRole("dialog", { name: "Image viewer" })).toBeInTheDocument();
  });

  it("opens the internal lightbox even without an onImageClick handler", async () => {
    const user = userEvent.setup();
    render(<ImageGrid images={makeImages(2)} />);

    await user.click(screen.getByRole("button", { name: "View image 1" }));

    expect(screen.getByRole("dialog", { name: "Image viewer" })).toBeInTheDocument();
  });

  it("opens the lightbox at the overflow tile's index when clicked", async () => {
    const user = userEvent.setup();
    render(<ImageGrid images={makeImages(6)} />);

    await user.click(screen.getByRole("button", { name: "View all 6 images" }));

    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Image 4" })).toBeInTheDocument();
  });
});
