import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DiffBlock } from "./DiffBlock";

describe("DiffBlock", () => {
  it("renders added lines with the added styling", () => {
    const { container } = render(<DiffBlock diff={"+const a = 1;\n+const b = 2;"} />);
    const lines = container.querySelectorAll('[data-diff-line="added"]');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveClass("bg-success/10");
    expect(lines[0]).toHaveTextContent("+const a = 1;");
  });

  it("renders removed lines with the removed styling", () => {
    const { container } = render(<DiffBlock diff={"-const a = 1;\n-const b = 2;"} />);
    const lines = container.querySelectorAll('[data-diff-line="removed"]');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveClass("bg-danger/10");
    expect(lines[0]).toHaveTextContent("-const a = 1;");
  });

  it("renders a mixed diff with both added and removed lines", () => {
    const { container } = render(
      <DiffBlock
        diff={"@@ -1,3 +1,3 @@\n context line\n-removed line\n+added line"}
      />,
    );
    expect(container.querySelectorAll('[data-diff-line="added"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-diff-line="removed"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-diff-line="context"]')).toHaveLength(1);
  });

  it("renders a hunk header line distinctly from context/added/removed lines", () => {
    const { container } = render(<DiffBlock diff={"@@ -1,3 +1,3 @@\n context"} />);
    const hunk = container.querySelector('[data-diff-line="hunk"]');
    expect(hunk).not.toBeNull();
    expect(hunk).toHaveTextContent("@@ -1,3 +1,3 @@");
    expect(hunk).toHaveClass("text-accent");
    expect(hunk).not.toHaveClass("bg-success/10");
    expect(hunk).not.toHaveClass("bg-danger/10");
  });

  it("renders +++/--- file header lines as neutral, not added/removed", () => {
    const { container } = render(<DiffBlock diff={"--- a/file.ts\n+++ b/file.ts\n context"} />);
    const headers = container.querySelectorAll('[data-diff-line="file-header"]');
    expect(headers).toHaveLength(2);
    expect(container.querySelectorAll('[data-diff-line="added"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-diff-line="removed"]')).toHaveLength(0);
  });

  it("shows the filename header when given", () => {
    render(<DiffBlock filename="greet.ts" diff="+const a = 1;" />);
    expect(screen.getByText("greet.ts")).toBeInTheDocument();
  });

  it("renders no filename header when omitted", () => {
    const { container } = render(<DiffBlock diff="+const a = 1;" />);
    expect(container.querySelector(".border-b")).toBeNull();
  });

  it("renders an empty diff without crashing", () => {
    const { container } = render(<DiffBlock diff="" />);
    expect(container.querySelectorAll("[data-diff-line]")).toHaveLength(0);
  });
});
