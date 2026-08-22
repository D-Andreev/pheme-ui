import type { HTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface EmptyThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading shown above the suggestions. Defaults to `"Start a conversation"`. */
  heading?: string;
  /** Suggested prompts rendered as buttons. Omit or pass an empty array to hide the row. */
  suggestions?: string[];
  /** Called with the suggestion text when a suggestion button is clicked. */
  onSuggestionSelect?: (suggestion: string) => void;
}

/**
 * Empty-state view shown before any messages exist in a thread.
 */
export function EmptyThread({
  heading = "Start a conversation",
  suggestions = [],
  onSuggestionSelect,
  className,
  ...rest
}: EmptyThreadProps) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center gap-ds-4 py-ds-8 text-center",
        className,
      )}
      {...rest}
    >
      <p className="m-0 font-heading text-xl text-text">{heading}</p>
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-ds-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={`${index}-${suggestion}`}
              variant="ghost"
              onClick={() => onSuggestionSelect?.(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
