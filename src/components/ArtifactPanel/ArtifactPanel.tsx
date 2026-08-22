import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../Button/Button";
import { CodeBlock } from "../CodeBlock/CodeBlock";

export type ArtifactMode = "preview" | "code";

export interface ArtifactPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Artifact name shown in the header. */
  title: string;
  /** Optional version label shown muted next to the title (e.g. `"v3"`). */
  version?: string;
  /** Which body view is active. Panel is fully controlled — no internal mode state. */
  mode: ArtifactMode;
  /** Called with the requested mode when either toggle button is clicked. */
  onModeChange: (mode: ArtifactMode) => void;
  /** Source shown in `"code"` mode, passed through to `CodeBlock`. */
  code?: string;
  /** `CodeBlock` language id for the `"code"` view. */
  language?: string;
  /** Called when the export control is clicked. Omit to hide the export button. */
  onExport?: () => void;
  /** Rendered in `"preview"` mode. */
  children?: ReactNode;
}

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 10.5V2M8 2L5 5M8 2l3 3"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10.5v2A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-2"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Side panel for split-view mode — a generated document/preview with its
 * own header (version, preview/code toggle, export). Renders the panel
 * only; laying it out beside a narrowed thread is a page-level concern.
 */
export function ArtifactPanel({
  title,
  version,
  mode,
  onModeChange,
  code,
  language,
  onExport,
  children,
  className,
  ...rest
}: ArtifactPanelProps) {
  return (
    <div
      className={cx(
        "flex h-full w-full sm:w-[380px] flex-col rounded-lg border border-divider bg-surface",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between gap-ds-2 border-b border-divider px-ds-3 py-ds-2">
        <div className="flex min-w-0 items-baseline gap-ds-2">
          <span className="truncate font-heading text-sm">{title}</span>
          {version && <span className="shrink-0 text-xs text-neutral-500">{version}</span>}
        </div>

        <div className="flex shrink-0 items-center gap-ds-2">
          <div className="flex items-center gap-ds-1">
            <Button
              variant={mode === "preview" ? "primary" : "secondary"}
              onClick={() => onModeChange("preview")}
              aria-pressed={mode === "preview"}
            >
              Preview
            </Button>
            <Button
              variant={mode === "code" ? "primary" : "secondary"}
              onClick={() => onModeChange("code")}
              aria-pressed={mode === "code"}
            >
              Code
            </Button>
          </div>

          {onExport && (
            <Button icon variant="ghost" aria-label="Export" onClick={onExport}>
              <ExportIcon />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-ds-3">
        {mode === "preview" ? children : <CodeBlock code={code ?? ""} language={language} />}
      </div>
    </div>
  );
}
