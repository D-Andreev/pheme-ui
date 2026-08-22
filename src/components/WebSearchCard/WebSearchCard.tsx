import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Card } from "../Card/Card";

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WebSearchCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "results"> {
  /** The search query that produced `results`. */
  query: string;
  results: WebSearchResult[];
  className?: string;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Card showing a web search query and its result rows — title link, domain,
 * and snippet per result, separated by the system's fading-rule divider.
 */
export function WebSearchCard({ query, results, className, ...rest }: WebSearchCardProps) {
  return (
    <Card className={cx("gap-ds-3", className)} {...rest}>
      <div className="flex items-center gap-ds-2">
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-neutral-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <line x1="16.5" y1="16.5" x2="12.7" y2="12.7" strokeLinecap="round" />
        </svg>
        <span className="font-heading text-sm text-text">{query}</span>
      </div>
      <div className="flex flex-col">
        {results.map((result, i) => (
          <div key={result.url}>
            {i > 0 && <div className="hr" />}
            <div className="flex flex-col gap-0.5 py-ds-2">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {result.title}
              </a>
              <span className="text-xs text-neutral-500">{hostname(result.url)}</span>
              <p className="m-0 text-sm opacity-80">{result.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
