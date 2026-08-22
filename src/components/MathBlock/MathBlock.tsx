import { useMemo } from "react";
import type { HTMLAttributes } from "react";
import katex from "katex";
import { cx } from "../../lib/cx";

export interface MathBlockProps extends HTMLAttributes<HTMLElement> {
  /** LaTeX source to render. */
  math: string;
  /** Renders as centered block math with vertical breathing room instead of inline flow. Defaults to `false`. */
  display?: boolean;
}

/**
 * KaTeX-backed math renderer — inline within text or as a standalone block.
 */
export function MathBlock({ math, display = false, className, ...rest }: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: !!display,
        throwOnError: false,
        output: "html",
      });
    } catch {
      return null;
    }
  }, [math, display]);

  if (html === null) {
    return (
      <span className={cx("text-danger", className)} {...rest}>
        {math}
      </span>
    );
  }

  if (display) {
    return (
      <div
        className={cx("overflow-x-auto py-ds-3 my-ds-2", className)}
        dangerouslySetInnerHTML={{ __html: html }}
        {...rest}
      />
    );
  }

  return (
    <span
      className={cx(className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...rest}
    />
  );
}
