import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Chart, computeBarHeight } from "./Chart";

describe("computeBarHeight", () => {
  it("scales a value proportionally against max", () => {
    expect(computeBarHeight(5, 10, 100)).toBe(50);
    expect(computeBarHeight(10, 10, 100)).toBe(100);
    expect(computeBarHeight(0, 10, 100)).toBe(0);
  });

  it("returns 0 when max is 0", () => {
    expect(computeBarHeight(5, 0, 100)).toBe(0);
  });

  it("returns 0 when max is negative", () => {
    expect(computeBarHeight(5, -1, 100)).toBe(0);
  });

  it("handles a differing maxHeightPx", () => {
    expect(computeBarHeight(3, 12, 40)).toBe(10);
  });
});

describe("Chart", () => {
  const data = [
    { label: "Mon", a: 10, b: 20 },
    { label: "Tue", a: 15, b: 5 },
    { label: "Wed", a: 8, b: 12 },
  ];

  it("renders one bar-group (two rects) per datum", () => {
    const { container } = render(<Chart data={data} />);
    expect(container.querySelectorAll("rect")).toHaveLength(data.length * 2);
  });

  it("renders an x-axis label per datum", () => {
    const { getByText } = render(<Chart data={data} />);
    for (const datum of data) {
      expect(getByText(datum.label)).toBeInTheDocument();
    }
  });

  it("renders default legend labels when none are provided", () => {
    const { getByText } = render(<Chart data={data} />);
    expect(getByText("A")).toBeInTheDocument();
    expect(getByText("B")).toBeInTheDocument();
  });

  it("renders custom legend labels", () => {
    const { getByText } = render(<Chart data={data} seriesLabels={["Before", "After"]} />);
    expect(getByText("Before")).toBeInTheDocument();
    expect(getByText("After")).toBeInTheDocument();
  });

  it("renders a single-point dataset without error", () => {
    const { container } = render(<Chart data={[{ label: "Today", a: 5, b: 9 }]} />);
    expect(container.querySelectorAll("rect")).toHaveLength(2);
  });
});
