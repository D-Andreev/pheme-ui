import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface CitationProps {
  /** 1-based citation number shown inside the marker. */
  index: number;
  /** Omit to render a non-interactive marker (e.g. inside `SourceList`). */
  onClick?: () => void;
  className?: string;
}

const markerClasses =
  "inline-flex items-center justify-center rounded-full bg-accent/15 px-1.5 text-xs font-heading text-accent";

/**
 * Inline numbered citation marker, e.g. `[1]`, linking prose to a source.
 * Renders as a button when interactive, or a plain span when it isn't —
 * a marker with no handler shouldn't be a focusable no-op.
 */
export function Citation({ index, onClick, className }: CitationProps) {
  const classes = cx(markerClasses, className);

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {index}
      </button>
    );
  }

  return <span className={classes}>{index}</span>;
}

export interface Source {
  /** 1-based index matching the `Citation` marker that points at this source. */
  index: number;
  title: string;
  url: string;
}

export interface SourceListProps extends HTMLAttributes<HTMLDivElement> {
  sources: Source[];
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
 * The list of sources a set of `Citation` markers point into — one row per
 * source, separated by the system's fading-rule divider.
 */
export function SourceList({ sources, className, ...rest }: SourceListProps) {
  return (
    <div className={cx("flex flex-col", className)} {...rest}>
      {sources.map((source, i) => (
        <div key={source.index}>
          {i > 0 && <div className="hr" />}
          <div className="flex items-center gap-ds-3 py-ds-2">
            <Citation index={source.index} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-ds-2">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm text-accent hover:underline"
              >
                {source.title}
              </a>
              <span className="shrink-0 truncate text-xs text-neutral-500">
                {hostname(source.url)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
