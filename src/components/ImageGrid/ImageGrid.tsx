import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Lightbox } from "../Lightbox/Lightbox";
import type { LightboxImage } from "../Lightbox/Lightbox";

export interface ImageGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Images to lay out — only the first 4 render as tiles. */
  images: LightboxImage[];
  /** Called with the clicked tile's index, in addition to opening the internal lightbox. */
  onImageClick?: (index: number) => void;
}

/**
 * A 2x2 grid of image thumbnails with an overflow-count tile beyond four
 * images. Self-contained: clicking a tile opens an internal `Lightbox`
 * without the parent needing to wire one up.
 */
export function ImageGrid({ images, onImageClick, className, ...rest }: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = images.slice(0, 4);
  const overflowCount = images.length > 4 ? images.length - 4 : 0;

  function handleTileClick(index: number) {
    onImageClick?.(index);
    setLightboxIndex(index);
  }

  return (
    <div className={cx("grid grid-cols-2 gap-ds-2", className)} {...rest}>
      {visible.map((image, i) => {
        const isOverflowTile = overflowCount > 0 && i === 3;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleTileClick(i)}
            className="relative aspect-square overflow-hidden rounded-md"
            aria-label={isOverflowTile ? `View all ${images.length} images` : `View image ${i + 1}`}
          >
            <img src={image.src} alt={image.alt ?? ""} className="h-full w-full object-cover" />
            {isOverflowTile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="font-heading text-lg font-medium text-text">+{overflowCount}</span>
              </div>
            )}
          </button>
        );
      })}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
