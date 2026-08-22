import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImagePreview } from "./ImagePreview";

const SRC = "https://example.com/image.png";

describe("ImagePreview", () => {
  it("renders a skeleton instead of an image while loading", () => {
    render(<ImagePreview src={SRC} alt="A cat" loading />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the image with the correct src and alt once loaded", () => {
    render(<ImagePreview src={SRC} alt="A cat" />);
    const img = screen.getByRole("img", { name: "A cat" });
    expect(img).toHaveAttribute("src", SRC);
  });

  it("calls onExpand when the expand action is clicked", async () => {
    const user = userEvent.setup();
    const onExpand = vi.fn();
    render(<ImagePreview src={SRC} onExpand={onExpand} />);
    await user.click(screen.getByRole("button", { name: "Expand image" }));
    expect(onExpand).toHaveBeenCalledOnce();
  });

  it("calls onDownload when the download action is clicked", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<ImagePreview src={SRC} onDownload={onDownload} />);
    await user.click(screen.getByRole("button", { name: "Download image" }));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it("omits the expand/download actions when their handlers aren't passed", () => {
    render(<ImagePreview src={SRC} />);
    expect(screen.queryByRole("button", { name: "Expand image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download image" })).not.toBeInTheDocument();
  });

  it("only renders the actions whose handlers are passed", () => {
    render(<ImagePreview src={SRC} onExpand={() => {}} />);
    expect(screen.getByRole("button", { name: "Expand image" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download image" })).not.toBeInTheDocument();
  });
});
