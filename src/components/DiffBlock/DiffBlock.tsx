import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

type DiffLineKind = "added" | "removed" | "hunk" | "file-header" | "context";

interface DiffLine {
  kind: DiffLineKind;
  text: string;
}

function classifyLine(line: string): DiffLine {
  if (line.startsWith("+++") || line.startsWith("---")) {
    return { kind: "file-header", text: line };
  }
  if (line.startsWith("@@")) {
    return { kind: "hunk", text: line };
  }
  if (line.startsWith("+")) {
    return { kind: "added", text: line };
  }
  if (line.startsWith("-")) {
    return { kind: "removed", text: line };
  }
  return { kind: "context", text: line };
}

const lineClasses: Record<DiffLineKind, string> = {
  added: "bg-success/10 text-success-300 border-l-2 border-success",
  removed: "bg-danger/10 text-danger-300 border-l-2 border-danger",
  hunk: "text-accent opacity-70 border-l-2 border-transparent",
  "file-header": "text-neutral-500 border-l-2 border-transparent",
  context: "text-text opacity-90 border-l-2 border-transparent",
};

export interface DiffBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Unified-diff text — lines may start with `+`, `-`, `@@`, `+++`/`---`, or be plain context. */
  diff: string;
  /** Optional filename shown in a simple header bar above the diff. */
  filename?: string;
}

/**
 * Renders unified-diff text with added/removed/hunk line styling. No
 * syntax highlighting — line-prefix-based coloring only.
 */
export function DiffBlock({ diff, filename, className, ...rest }: DiffBlockProps) {
  const lines = diff.length > 0 ? diff.split("\n").map(classifyLine) : [];

  return (
    <div
      className={cx(
        "rounded-md border border-divider bg-code-ground font-mono text-sm text-text",
        className,
      )}
      {...rest}
    >
      {filename && (
        <div className="border-b border-divider px-ds-3 py-ds-2 font-sans text-xs text-neutral-400">
          <span className="truncate">{filename}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="m-0 py-ds-2">
          {lines.map((line, index) => (
            <div
              key={index}
              data-diff-line={line.kind}
              className={cx("whitespace-pre px-ds-3 leading-6", lineClasses[line.kind])}
            >
              {line.text.length > 0 ? line.text : " "}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
