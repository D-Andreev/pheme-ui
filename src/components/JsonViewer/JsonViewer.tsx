import { useState } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface JsonViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** The JSON-serializable value to render (object, array, primitive, null, or undefined). */
  data: unknown;
  /** Optional root key label shown before the value, e.g. `"result"`. */
  name?: string;
  /**
   * Controls which levels start expanded. `true` expands every level,
   * `false` (default) expands only the root, and a number expands that
   * many levels deep from the root.
   */
  defaultExpanded?: boolean | number;
}

type JsonValueType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "undefined";

function getValueType(value: unknown): JsonValueType {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "object":
      return "object";
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "undefined";
  }
}

function isDepthExpandedByDefault(depth: number, defaultExpanded: boolean | number): boolean {
  if (defaultExpanded === true) return true;
  if (defaultExpanded === false) return depth < 1;
  return depth < defaultExpanded;
}

function indentStyle(depth: number): CSSProperties | undefined {
  return depth > 0 ? { paddingLeft: `calc(var(--space-4) * ${depth})` } : undefined;
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

function PrimitiveValue({ type, value }: { type: JsonValueType; value: unknown }) {
  switch (type) {
    case "string":
      return <span className="font-mono text-success-300">{`"${value as string}"`}</span>;
    case "number":
      return <span className="font-mono text-accent2-400">{String(value)}</span>;
    case "boolean":
      return <span className="font-mono text-accent-300">{String(value)}</span>;
    case "null":
      return <span className="font-mono text-neutral-500 italic">null</span>;
    case "undefined":
      return <span className="font-mono text-neutral-500 italic">undefined</span>;
    default:
      return null;
  }
}

interface JsonNodeProps {
  keyLabel?: string;
  value: unknown;
  depth: number;
  defaultExpanded: boolean | number;
}

/**
 * One node of the tree — recurses into its own children, each computing its
 * own expanded/collapsed state seeded from `depth` vs. `defaultExpanded`.
 */
function JsonNode({ keyLabel, value, depth, defaultExpanded }: JsonNodeProps) {
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const [expanded, setExpanded] = useState(
    () => isExpandable && isDepthExpandedByDefault(depth, defaultExpanded),
  );

  if (!isExpandable) {
    return (
      <div className="flex items-baseline gap-ds-1" style={indentStyle(depth)}>
        {keyLabel !== undefined && <span className="font-mono text-text">{keyLabel}:</span>}
        <PrimitiveValue type={type} value={value} />
      </div>
    );
  }

  const entries: Array<[string, unknown]> =
    type === "array"
      ? (value as unknown[]).map((item, index) => [String(index), item])
      : Object.entries(value as Record<string, unknown>);

  const count = entries.length;
  const summary = type === "array" ? `Array(${count})` : count === 0 ? "{}" : "{…}";

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-ds-1 border-0 bg-transparent p-0 font-mono text-text cursor-pointer hover:text-accent"
        style={indentStyle(depth)}
      >
        <Chevron expanded={expanded} />
        {keyLabel !== undefined && <span>{keyLabel}:</span>}
        {!expanded && <span className="text-neutral-500">{summary}</span>}
      </button>
      {expanded && (
        <div>
          {entries.map(([childKey, childValue]) => (
            <JsonNode
              key={childKey}
              keyLabel={childKey}
              value={childValue}
              depth={depth + 1}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Recursive, expandable/collapsible tree view for arbitrary JSON-serializable
 * data — generic enough for a debug panel, an API response inspector, or a
 * future tool-call arguments/results display.
 */
export function JsonViewer({
  data,
  name,
  defaultExpanded = false,
  className,
  ...rest
}: JsonViewerProps) {
  return (
    <div className={cx("overflow-x-auto font-mono text-sm", className)} {...rest}>
      <JsonNode keyLabel={name} value={data} depth={0} defaultExpanded={defaultExpanded} />
    </div>
  );
}
