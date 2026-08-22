import type { ChangeEvent, KeyboardEvent } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface ComposerAttachment {
  /** Stable identifier, passed back to `onRemoveAttachment`. */
  id: string;
  /** Display name shown on the chip. */
  filename: string;
}

export interface ComposerProps {
  /** Current textarea content. Composer is fully controlled — no internal text state. */
  value: string;
  /** Called with the new text on every keystroke. */
  onChange: (value: string) => void;
  /** Called when the user submits (Enter, or clicking send). Not called while over-limit, empty, or generating. */
  onSubmit: () => void;
  /** Files attached to the in-progress message. */
  attachments?: ComposerAttachment[];
  /** Called with an attachment's `id` when its remove (×) control is clicked. Omit to hide remove controls. */
  onRemoveAttachment?: (id: string) => void;
  /** True while an assistant response is streaming in — read-onlys the textarea and swaps in a stop-style control. */
  generating?: boolean;
  /**
   * Called when the stop control is clicked while `generating` is true.
   * Omit to leave the control inert (e.g. while a stop endpoint isn't wired
   * up yet) — it stays disabled and reads as a status indicator instead.
   */
  onStop?: () => void;
  /** When set, shows a live character counter and blocks submission once `value.length` exceeds it. */
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 3.5l9 9M12.5 3.5l-9 9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Chat message input — controlled from outside, with attachments, a
 * generating (streaming) state, and an optional max-length guard.
 */
export function Composer({
  value,
  onChange,
  onSubmit,
  attachments = [],
  onRemoveAttachment,
  generating = false,
  onStop,
  maxLength,
  placeholder = "Send a message...",
  className,
}: ComposerProps) {
  const isOverLimit = typeof maxLength === "number" && value.length > maxLength;
  const isEmpty = value.trim().length === 0;
  const canSubmit = !isEmpty && !generating && !isOverLimit;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit();
  };

  const handleActionClick = () => {
    if (generating) {
      onStop?.();
      return;
    }
    submit();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cx(
        "flex flex-col gap-ds-2 rounded-lg border bg-surface p-ds-3",
        "focus-within:ring-1 focus-within:ring-accent focus-within:border-accent",
        isOverLimit ? "border-danger" : "border-divider",
        className,
      )}
    >
      {attachments.length > 0 ? (
        <div className="flex flex-wrap gap-ds-2">
          {attachments.map((attachment) => (
            <span
              key={attachment.id}
              className="inline-flex max-w-full items-center gap-ds-1 rounded-md border border-divider bg-bg px-ds-2 py-ds-1 font-body text-xs text-text"
            >
              <span className="min-w-0 max-w-[10rem] truncate" title={attachment.filename}>
                {attachment.filename}
              </span>
              {onRemoveAttachment ? (
                <button
                  type="button"
                  aria-label={`Remove ${attachment.filename}`}
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="shrink-0 rounded-sm text-neutral-400 hover:text-text"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={generating}
        placeholder={placeholder}
        rows={1}
        className={cx(
          "min-h-[2.5rem] max-h-40 w-full resize-none overflow-y-auto bg-transparent",
          "font-body text-sm text-text placeholder:text-neutral-400 focus:outline-none",
          generating ? "opacity-70" : "",
        )}
      />

      <div className="flex items-center justify-between gap-ds-2">
        {typeof maxLength === "number" ? (
          <span
            className={cx(
              "font-body text-xs",
              isOverLimit ? "text-danger" : "text-neutral-400",
            )}
          >
            {value.length}/{maxLength}
          </span>
        ) : (
          <span />
        )}

        <Button
          icon
          variant="primary"
          aria-label={generating ? (onStop ? "Stop generating" : "Generating response") : "Send message"}
          disabled={generating ? !onStop : !canSubmit}
          onClick={handleActionClick}
          className={generating ? "animate-pulse" : ""}
        >
          {generating ? <StopIcon /> : <SendIcon />}
        </Button>
      </div>
    </div>
  );
}
