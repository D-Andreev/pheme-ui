import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolCallCard } from "./ToolCallCard";

describe("ToolCallCard", () => {
  it("renders only the header row when collapsed by default", () => {
    render(
      <ToolCallCard
        name="search_files"
        args={{ query: "foo" }}
        status="success"
        result={{ matches: 1 }}
      />,
    );
    expect(screen.getByRole("button", { name: /search_files/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("Arguments")).not.toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("expands on header click and re-collapses on a second click", async () => {
    const user = userEvent.setup();
    render(
      <ToolCallCard
        name="search_files"
        args={{ query: "foo" }}
        status="success"
        result={{ matches: 1 }}
      />,
    );
    const toggle = screen.getByRole("button", { name: /search_files/ });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Arguments")).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Arguments")).not.toBeInTheDocument();
  });

  it("running: shows only the arguments band, no result or error", () => {
    render(
      <ToolCallCard
        name="search_files"
        args={{ query: "foo" }}
        status="running"
        defaultExpanded
      />,
    );
    expect(screen.getByText("Arguments")).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  it("success: shows both arguments and result bands", () => {
    render(
      <ToolCallCard
        name="search_files"
        args={{ query: "foo" }}
        status="success"
        result={{ matches: 2 }}
        defaultExpanded
      />,
    );
    expect(screen.getByText("Arguments")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  it("failed: shows the error band and not a result band", () => {
    render(
      <ToolCallCard
        name="run_shell"
        args={{ command: "pnpm test" }}
        status="failed"
        error="Something broke"
        defaultExpanded
      />,
    );
    expect(screen.getByText("Arguments")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("failed: falls back to a placeholder when error is empty or omitted", () => {
    render(
      <ToolCallCard name="run_shell" args={{ command: "pnpm test" }} status="failed" defaultExpanded />,
    );
    expect(screen.getByText("No error details were provided.")).toBeInTheDocument();
  });
});
