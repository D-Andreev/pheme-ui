import { useEffect } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../Button/Button";

export interface LightboxImage {
  src: string;
  alt?: string;
}

export interface LightboxProps extends HTMLAttributes<HTMLDivElement> {
  /** Images available for navigation. */
  images: LightboxImage[];
  /** Index of the currently displayed image within `images`. */
  index: number;
  /** Called when the viewer is dismissed (close button or Escape). */
  onClose: () => void;
  /** Called with the next index to display (prev/next buttons or arrow keys). */
  onNavigate: (index: number) => void;
}

/**
 * Full-screen overlay for viewing one image from a set at a time, with
 * wraparound prev/next navigation and arrow-key / Escape keyboard support.
 */
export function Lightbox({ images, index, onClose, onNavigate, className, ...rest }: LightboxProps) {
  const hasMultiple = images.length > 1;
  const current = images[index];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        onNavigate((index - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight") {
        onNavigate((index + 1) % images.length);
      } else if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, index, onClose, onNavigate]);

  if (!current) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className={cx("fixed inset-0 z-50 flex items-center justify-center bg-black/80", className)}
      {...rest}
    >
      <Button
        icon
        variant="ghost"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-ds-4 top-ds-4 text-text"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Button>

      {hasMultiple && (
        <Button
          icon
          variant="ghost"
          aria-label="Previous image"
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          className="absolute left-ds-2 top-1/2 -translate-y-1/2 text-text sm:left-ds-4"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      )}

      <img src={current.src} alt={current.alt ?? ""} className="max-h-[85vh] max-w-[90vw] rounded-md object-contain" />

      {hasMultiple && (
        <Button
          icon
          variant="ghost"
          aria-label="Next image"
          onClick={() => onNavigate((index + 1) % images.length)}
          className="absolute right-ds-2 top-1/2 -translate-y-1/2 text-text sm:right-ds-4"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}
