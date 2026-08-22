import type { HTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Error text to display. */
  message: string;
  /** Called when the retry action is activated. Omit to hide the action entirely. */
  onRetry?: () => void;
}

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.5l7 12.5H1L8 1.5z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path d="M8 6.25v3.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <circle cx="8" cy="11.75" r="0.75" fill="currentColor" />
  </svg>
);

/**
 * Inline danger-toned error state for a failed response, with an optional retry action.
 */
export function ErrorMessage({ message, onRetry, className, ...rest }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cx(
        "flex items-center gap-ds-2 rounded-md border border-danger/30 bg-danger/10 p-ds-3 text-danger-300",
        className,
      )}
      {...rest}
    >
      <span className="shrink-0" aria-hidden="true">
        <WarningIcon />
      </span>
      <p className="m-0 flex-1 font-body text-sm">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} className="shrink-0">
          Retry
        </Button>
      ) : null}
    </div>
  );
}
