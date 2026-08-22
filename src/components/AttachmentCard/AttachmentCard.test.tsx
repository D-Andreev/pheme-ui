import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AttachmentCard } from "./AttachmentCard";

describe("AttachmentCard", () => {
  it("renders filename and size", () => {
    render(<AttachmentCard filename="report.pdf" size="1.2 MB" />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("1.2 MB")).toBeInTheDocument();
  });

  it("defaults to the success status", () => {
    render(<AttachmentCard filename="report.pdf" />);
    expect(screen.getByLabelText("Upload complete")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows a progress bar sized to progress when uploading", () => {
    render(<AttachmentCard filename="report.pdf" status="uploading" progress={42} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");
    expect(progressbar.firstElementChild).toHaveStyle({ width: "42%" });
    expect(screen.queryByLabelText("Upload complete")).not.toBeInTheDocument();
  });

  it("shows the success indicator and no progress bar on success", () => {
    render(<AttachmentCard filename="report.pdf" status="success" />);
    expect(screen.getByLabelText("Upload complete")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows the error message and danger styling on error", () => {
    render(
      <AttachmentCard
        filename="report.pdf"
        status="error"
        errorMessage="Upload failed — network error."
      />,
    );
    expect(screen.getByText("Upload failed — network error.")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toHaveClass("text-danger-300");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Upload complete")).not.toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<AttachmentCard filename="report.pdf" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remove report.pdf" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("shows a distinct retry control on error, separate from remove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onRetry = vi.fn();
    render(
      <AttachmentCard
        filename="report.pdf"
        status="error"
        errorMessage="Network error."
        onRemove={onRemove}
        onRetry={onRetry}
      />,
    );

    const retryButton = screen.getByRole("button", { name: "Retry upload of report.pdf" });
    const removeButton = screen.getByRole("button", { name: "Remove report.pdf" });
    expect(retryButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onRemove).not.toHaveBeenCalled();

    await user.click(removeButton);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("omits the retry control on error when onRetry is not provided", () => {
    render(
      <AttachmentCard
        filename="report.pdf"
        status="error"
        errorMessage="Network error."
        onRemove={() => {}}
      />,
    );
    expect(screen.queryByRole("button", { name: "Retry upload of report.pdf" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove report.pdf" })).toBeInTheDocument();
  });

  it("omits the retry control outside of the error status even if onRetry is provided", () => {
    render(<AttachmentCard filename="report.pdf" status="success" onRetry={() => {}} />);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });

  it("omits the remove button when onRemove is not provided", () => {
    render(<AttachmentCard filename="report.pdf" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
