import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardBody, CardTitle } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <CardTitle>Assistant</CardTitle>
        <CardBody>A minimal shell, no chat logic yet.</CardBody>
      </Card>,
    );
    expect(screen.getByText("Assistant")).toBeInTheDocument();
    expect(screen.getByText("A minimal shell, no chat logic yet.")).toBeInTheDocument();
  });

  it("defaults to sm elevation", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstElementChild).toHaveClass("shadow-sm");
  });

  it("applies the requested elevation", () => {
    const { container } = render(<Card elevation="lg">content</Card>);
    expect(container.firstElementChild).toHaveClass("shadow-lg");
  });

  it("applies no shadow class when elevation is none", () => {
    const { container } = render(<Card elevation="none">content</Card>);
    expect(container.firstElementChild).not.toHaveClass("shadow-sm");
    expect(container.firstElementChild).not.toHaveClass("shadow-md");
    expect(container.firstElementChild).not.toHaveClass("shadow-lg");
  });
});
