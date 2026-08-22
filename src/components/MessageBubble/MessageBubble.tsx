import type { HTMLAttributes, ReactNode } from "react";
import { Card } from "../Card/Card";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface MessageBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** Message content — plain text or already-rendered markdown. */
  content: ReactNode;
  /** Reveals a hover/focus-visible edit action when true. */
  editable?: boolean;
  /** Called when the edit action is activated. */
  onEdit?: () => void;
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M11.2 2.3l2.5 2.5-7.9 7.9-3.4.9.9-3.4 7.9-7.9z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The user's own chat message bubble — a right-aligned, accent-tinted Card.
 */
export function MessageBubble({
  content,
  editable = false,
  onEdit,
  className,
  ...rest
}: MessageBubbleProps) {
  return (
    <div className={cx("group relative ml-auto max-w-[85%] sm:max-w-prose", className)} {...rest}>
      <Card elevation="sm" className="border border-accent/20 bg-accent/10">
        {content}
      </Card>
      {editable ? (
        <Button
          icon
          variant="ghost"
          aria-label="Edit message"
          onClick={onEdit}
          className={cx(
            "absolute -left-9 top-1 opacity-0 transition-opacity",
            "group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100",
          )}
        >
          <EditIcon />
        </Button>
      ) : null}
    </div>
  );
}
