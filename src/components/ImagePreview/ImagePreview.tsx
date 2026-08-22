import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../Button/Button";

export interface ImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL to render. */
  src: string;
  /** Accessible alt text. Defaults to an empty (decorative) string. */
  alt?: string;
  /** Renders a shimmering skeleton in place of the image. Defaults to `false`. */
  loading?: boolean;
  /** Called when the expand hover-action is clicked. Omit to hide the control. */
  onExpand?: () => void;
  /** Called when the download hover-action is clicked. Omit to hide the control. */
  onDownload?: () => void;
}

/**
 * A single chat image — a loading skeleton, or the loaded image with
 * hover-revealed expand/download actions.
 */
export function ImagePreview({
  src,
  alt,
  loading = false,
  onExpand,
  onDownload,
  className,
  ...rest
}: ImagePreviewProps) {
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading image"
        className={cx(
          "aspect-video w-full rounded-md",
          "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800",
          "bg-shimmer animate-shimmer",
          className,
        )}
        {...rest}
      />
    );
  }

  const hasActions = !!(onExpand || onDownload);

  return (
    <div className={cx("group relative aspect-video w-full overflow-hidden rounded-md", className)} {...rest}>
      <img src={src} alt={alt ?? ""} className="h-full w-full rounded-md object-cover" />
      {hasActions && (
        <div className="absolute bottom-ds-2 right-ds-2 flex gap-ds-1 rounded-md bg-black/50 p-ds-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {onExpand && (
            <Button icon variant="ghost" aria-label="Expand image" onClick={onExpand}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
          {onDownload && (
            <Button icon variant="ghost" aria-label="Download image" onClick={onDownload}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 2v8m0 0-3-3m3 3 3-3M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
