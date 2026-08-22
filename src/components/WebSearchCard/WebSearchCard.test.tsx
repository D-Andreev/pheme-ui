import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WebSearchCard } from "./WebSearchCard";

describe("WebSearchCard", () => {
  const results = [
    {
      title: "First Result",
      url: "https://example.com/first",
      snippet: "The first snippet of text.",
    },
    {
      title: "Second Result",
      url: "https://example.org/second",
      snippet: "The second snippet of text.",
    },
  ];

  it("renders the query", () => {
    render(<WebSearchCard query="test query" results={results} />);
    expect(screen.getByText("test query")).toBeInTheDocument();
  });

  it("renders each result's title and snippet", () => {
    render(<WebSearchCard query="test query" results={results} />);
    for (const result of results) {
      expect(screen.getByText(result.title)).toBeInTheDocument();
      expect(screen.getByText(result.title)).toHaveAttribute("href", result.url);
      expect(screen.getByText(result.snippet)).toBeInTheDocument();
    }
  });

  it("renders results.length - 1 dividers", () => {
    const { container } = render(<WebSearchCard query="test query" results={results} />);
    expect(container.querySelectorAll(".hr")).toHaveLength(results.length - 1);
  });
});
