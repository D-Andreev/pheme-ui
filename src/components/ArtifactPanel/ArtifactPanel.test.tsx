import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArtifactPanel } from "./ArtifactPanel";

const sampleCode = "const x = 1;";

describe("ArtifactPanel", () => {
  it("renders the title and version", () => {
    render(
      <ArtifactPanel title="onboarding.md" version="v3" mode="preview" onModeChange={() => {}}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    expect(screen.getByText("onboarding.md")).toBeInTheDocument();
    expect(screen.getByText("v3")).toBeInTheDocument();
  });

  it("renders without a version label when omitted", () => {
    render(
      <ArtifactPanel title="onboarding.md" mode="preview" onModeChange={() => {}}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    expect(screen.queryByText("v3")).not.toBeInTheDocument();
  });

  it("renders children in preview mode and not the code view", () => {
    render(
      <ArtifactPanel
        title="onboarding.md"
        mode="preview"
        onModeChange={() => {}}
        code={sampleCode}
        language="javascript"
      >
        <p>Preview body content</p>
      </ArtifactPanel>,
    );
    expect(screen.getByText("Preview body content")).toBeInTheDocument();
    expect(screen.queryByText(sampleCode)).not.toBeInTheDocument();
  });

  it("renders CodeBlock output in code mode and not children", () => {
    render(
      <ArtifactPanel
        title="onboarding.md"
        mode="code"
        onModeChange={() => {}}
        code={sampleCode}
        language="javascript"
      >
        <p>Preview body content</p>
      </ArtifactPanel>,
    );
    expect(screen.queryByText("Preview body content")).not.toBeInTheDocument();
    expect(screen.getByText((_, node) => node?.textContent === sampleCode)).toBeInTheDocument();
  });

  it("calls onModeChange with 'preview' when the Preview toggle is clicked", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(
      <ArtifactPanel title="onboarding.md" mode="code" onModeChange={onModeChange}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(onModeChange).toHaveBeenCalledWith("preview");
  });

  it("calls onModeChange with 'code' when the Code toggle is clicked", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(
      <ArtifactPanel title="onboarding.md" mode="preview" onModeChange={onModeChange}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    await user.click(screen.getByRole("button", { name: "Code" }));
    expect(onModeChange).toHaveBeenCalledWith("code");
  });

  it("visually distinguishes the active mode's toggle button", () => {
    render(
      <ArtifactPanel title="onboarding.md" mode="preview" onModeChange={() => {}}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    const previewButton = screen.getByRole("button", { name: "Preview" });
    const codeButton = screen.getByRole("button", { name: "Code" });
    expect(previewButton.className).toContain("text-accent");
    expect(codeButton.className).not.toContain("text-accent");
    expect(previewButton).toHaveAttribute("aria-pressed", "true");
    expect(codeButton).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onExport when the export button is clicked", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <ArtifactPanel
        title="onboarding.md"
        mode="preview"
        onModeChange={() => {}}
        onExport={onExport}
      >
        <p>Body</p>
      </ArtifactPanel>,
    );
    await user.click(screen.getByRole("button", { name: "Export" }));
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("does not render an export button when onExport is not provided", () => {
    render(
      <ArtifactPanel title="onboarding.md" mode="preview" onModeChange={() => {}}>
        <p>Body</p>
      </ArtifactPanel>,
    );
    expect(screen.queryByRole("button", { name: "Export" })).not.toBeInTheDocument();
  });
});
