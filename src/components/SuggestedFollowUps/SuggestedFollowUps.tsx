import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../Button/Button";

export interface SuggestedFollowUpsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
  className?: string;
}

/**
 * Left-aligned wrap of suggested-question buttons, shown after an assistant
 * response. Renders nothing when there are no suggestions.
 */
export function SuggestedFollowUps({
  suggestions,
  onSelect,
  className,
  ...rest
}: SuggestedFollowUpsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cx("flex flex-wrap justify-start gap-ds-2", className)} {...rest}>
      {suggestions.map((suggestion, i) => (
        <Button
          key={`${suggestion}-${i}`}
          variant="ghost"
          onClick={() => onSelect?.(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
