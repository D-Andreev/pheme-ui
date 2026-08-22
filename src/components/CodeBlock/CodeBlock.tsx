import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import { cx } from "../../lib/cx";
import { Button } from "../Button/Button";

const COPY_RESET_MS = 1500;

/** Escapes HTML-significant characters so untrusted code renders as literal text. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Raw source code to display. */
  code: string;
  /** Prism language id (e.g. `"typescript"`, `"bash"`). Falls back to plain escaped text when unsupported. */
  language?: string;
  /** Optional filename shown in the header bar in place of the language id. */
  filename?: string;
  /** Renders a numbered line gutter to the left of the code. */
  showLineNumbers?: boolean;
}

/**
 * Syntax-highlighted code block (Prism-powered) with an optional
 * filename/copy header and line-number gutter.
 */
export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  className,
  ...rest
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, []);

  const html = useMemo(() => {
    const grammar = language ? Prism.languages[language] : undefined;
    return grammar ? Prism.highlight(code, grammar, language as string) : escapeHtml(code);
  }, [code, language]);

  const lines = useMemo(() => code.split("\n"), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // Clipboard API unavailable or denied — nothing to recover from here.
    }
  };

  const showHeader = Boolean(filename || language);

  return (
    <div
      className={cx(
        "pheme-code rounded-md border border-divider bg-code-ground font-mono text-sm text-text",
        className,
      )}
      {...rest}
    >
      {showHeader && (
        <div className="flex items-center justify-between gap-ds-2 border-b border-divider px-ds-3 py-ds-2 font-sans text-xs text-neutral-400">
          <span className="truncate">{filename ?? language}</span>
          <Button
            type="button"
            variant="ghost"
            className="font-sans text-xs"
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="flex">
          {showLineNumbers && (
            <div
              aria-hidden="true"
              className="select-none shrink-0 border-r border-divider py-ds-3 pl-ds-3 pr-ds-2 text-right text-neutral-500"
            >
              {lines.map((_, index) => (
                <div key={index} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          <pre className="m-0 min-w-0 flex-1 p-ds-3 leading-6">
            <code
              className={language ? `language-${language}` : undefined}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
