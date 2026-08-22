import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { JsonViewer } from "../JsonViewer/JsonViewer";

export type ToolCallStatus = "running" | "success" | "failed";

export interface ToolCallCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "result"> {
  /** The tool's name, e.g. `"search_files"`. */
  name: string;
  /** Arguments the tool was called with. */
  args: unknown;
  /** Current lifecycle state of the call. */
  status: ToolCallStatus;
  /** The tool's return value. Shown only when `status === "success"`. */
  result?: unknown;
  /** Error message. Shown only when `status === "failed"`. */
  error?: string;
  /** Whether the card starts expanded. Defaults to `false`. */
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

function StatusIndicator({ status }: { status: ToolCallStatus }) {
  if (status === "running") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
        className="shrink-0 animate-spin text-neutral-400"
      >
        <path d="M8 2a6 6 0 1 1-6 6" />
      </svg>
    );
  }
  if (status === "success") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 text-success-300"
      >
        <path d="M3 8.5l3.2 3.2L13 4.5" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0 text-danger-300"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

const statusLabel: Record<ToolCallStatus, string> = {
  running: "Running",
  success: "Success",
  failed: "Failed",
};

/**
 * Card for a single tool invocation — name, status, arguments, and (once
 * resolved) either its result or its error. Distinct from `ThinkingBlock`,
 * which shows reasoning text rather than a structured call.
 */
export function ToolCallCard({
  name,
  args,
  status,
  result,
  error,
  defaultExpanded = false,
  className,
  ...rest
}: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cx("rounded-md border border-divider bg-surface", className)} {...rest}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-ds-2 border-0 bg-transparent p-ds-3 text-left cursor-pointer"
      >
        <StatusIndicator status={status} />
        <span className="sr-only">{statusLabel[status]}</span>
        <span className="flex-1 truncate font-mono text-sm text-text">{name}</span>
        <Chevron expanded={expanded} />
      </button>
      {expanded && (
        <div className="flex flex-col gap-ds-3 border-t border-divider px-ds-3 pb-ds-3 pt-ds-2">
          <div className="flex flex-col gap-ds-1">
            <span className="font-heading text-xs uppercase tracking-wide text-neutral-500">
              Arguments
            </span>
            <JsonViewer data={args} />
          </div>
          {status === "success" && result !== undefined && (
            <div className="flex flex-col gap-ds-1">
              <span className="font-heading text-xs uppercase tracking-wide text-neutral-500">
                Result
              </span>
              <JsonViewer data={result} />
            </div>
          )}
          {status === "failed" && (
            <div className="flex flex-col gap-ds-1">
              <span className="font-heading text-xs uppercase tracking-wide text-neutral-500">
                Error
              </span>
              <div className="rounded-sm bg-danger/10 p-ds-2 font-mono text-sm text-danger-300">
                {error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
