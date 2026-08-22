import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface ThinkingBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** The reasoning / chain-of-thought text. */
  content: string;
  /** Whether reasoning is still streaming in. Swaps the label and shows a pulsing indicator. */
  streaming?: boolean;
  /** Whether the body starts expanded. Defaults to `false`. */
  defaultExpanded?: boolean;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx("shrink-0 transition-transform duration-150", expanded && "rotate-90")}
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

/**
 * Collapsible display for a model's reasoning / chain-of-thought, distinct
 * from a tool-call card — just a label, a toggle, and pre-wrapped text.
 */
export function ThinkingBlock({
  content,
  streaming = false,
  defaultExpanded = false,
  className,
  ...rest
}: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cx("flex flex-col", className)} {...rest}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-ds-2 self-start border-0 bg-transparent p-0 font-heading text-sm text-neutral-400 cursor-pointer hover:text-text"
      >
        <Chevron expanded={expanded} />
        <span>{streaming ? "Thinking…" : "Thought process"}</span>
        {streaming && (
          <span
            aria-hidden="true"
            data-testid="thinking-streaming-indicator"
            className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
          />
        )}
      </button>
      {expanded && (
        <p className="m-0 mt-ds-2 whitespace-pre-wrap font-body text-sm text-neutral-400">
          {content}
        </p>
      )}
    </div>
  );
}
