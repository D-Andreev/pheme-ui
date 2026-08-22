import type { HTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export type AttachmentCardStatus = "uploading" | "success" | "error";

export interface AttachmentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Name of the attached file. */
  filename: string;
  /** Human-readable size label, e.g. `"1.2 MB"`. */
  size?: string;
  /** Upload state. Defaults to `"success"`. */
  status?: AttachmentCardStatus;
  /** Upload progress 0-100. Only rendered when `status="uploading"`. */
  progress?: number;
  /** Error detail shown when `status="error"`. */
  errorMessage?: string;
  /** Called when the remove/retry (×) control is clicked. Omit to hide the control entirely. */
  onRemove?: () => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8.5l3 3 6-7"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 3.5l9 9M12.5 3.5l-9 9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * File-attachment chip showing filename/size alongside uploading, success,
 * or error state.
 */
export function AttachmentCard({
  filename,
  size,
  status = "success",
  progress,
  errorMessage,
  onRemove,
  className,
  ...rest
}: AttachmentCardProps) {
  const isError = status === "error";

  return (
    <div
      className={cx(
        "flex items-center gap-ds-3 rounded-md border p-ds-3 bg-surface",
        isError ? "border-danger" : "border-divider",
        className,
      )}
      {...rest}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-ds-1">
        <div className="flex items-center gap-ds-2 min-w-0">
          <span
            className={cx(
              "truncate min-w-0 font-heading text-sm",
              isError ? "text-danger-300" : "text-text",
            )}
            title={filename}
          >
            {filename}
          </span>
          {size ? (
            <span className="shrink-0 font-body text-xs text-neutral-400">{size}</span>
          ) : null}
        </div>

        {status === "uploading" ? (
          <div
            role="progressbar"
            aria-valuenow={progress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Uploading ${filename}`}
            className="h-1.5 w-full overflow-hidden rounded-sm bg-neutral-700"
          >
            <div
              className="h-full rounded-sm bg-accent"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        ) : null}

        {isError && errorMessage ? (
          <p className="m-0 font-body text-xs text-danger-300">{errorMessage}</p>
        ) : null}
      </div>

      {status === "success" ? (
        <span className="shrink-0 text-success-300" aria-label="Upload complete">
          <CheckIcon />
        </span>
      ) : null}

      {onRemove ? (
        <Button
          icon
          variant="ghost"
          aria-label={isError ? `Retry upload of ${filename}` : `Remove ${filename}`}
          onClick={onRemove}
          className="shrink-0"
        >
          <CloseIcon />
        </Button>
      ) : null}
    </div>
  );
}
