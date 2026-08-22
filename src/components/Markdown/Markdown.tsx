import type { HTMLAttributes, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cx } from "../../lib/cx";
import { CodeBlock } from "../CodeBlock/CodeBlock";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Raw markdown (GFM + LaTeX math) source to render. */
  content: string;
}

const headingClasses: Record<number, string> = {
  1: "font-heading font-medium text-text text-2xl leading-tight mt-ds-8 mb-ds-3",
  2: "font-heading font-medium text-text text-xl leading-tight mt-ds-6 mb-ds-2",
  3: "font-heading font-medium text-text text-lg leading-tight mt-ds-6 mb-ds-2",
  4: "font-heading font-medium text-text text-base leading-tight mt-ds-4 mb-ds-2",
  5: "font-heading font-medium text-text text-sm leading-tight mt-ds-4 mb-ds-2",
  6: "font-heading font-medium text-text text-xs leading-tight mt-ds-4 mb-ds-2",
};

function makeHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  function Heading({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag className={headingClasses[level]} {...rest}>
        {children}
      </Tag>
    );
  }
  return Heading;
}

/**
 * Extracts the language + literal text out of the `<code>` child that
 * react-markdown v10 nests inside `pre` for a fenced code block, so it can
 * be handed to `CodeBlock` instead of rendered as a bare `<pre><code>`.
 */
function extractCodeProps(children: ReactNode): { language?: string; code: string } {
  const codeEl = Array.isArray(children) ? children[0] : children;
  const codeProps = (codeEl as { props?: { className?: string; children?: ReactNode } } | null | undefined)
    ?.props ?? {};
  const codeClassName = codeProps.className ?? "";
  const match = /language-(\w+)/.exec(codeClassName);
  const codeText = String(codeProps.children ?? "").replace(/\n$/, "");
  return { language: match?.[1], code: codeText };
}

const components: Components = {
  h1: makeHeading(1),
  h2: makeHeading(2),
  h3: makeHeading(3),
  h4: makeHeading(4),
  h5: makeHeading(5),
  h6: makeHeading(6),
  p({ children, ...rest }) {
    return (
      <p className="my-ds-2 leading-relaxed" {...rest}>
        {children}
      </p>
    );
  },
  ul({ children, ...rest }) {
    return (
      <ul className="list-disc pl-ds-6 my-ds-2" {...rest}>
        {children}
      </ul>
    );
  },
  ol({ children, ...rest }) {
    return (
      <ol className="list-decimal pl-ds-6 my-ds-2" {...rest}>
        {children}
      </ol>
    );
  },
  blockquote({ children, ...rest }) {
    return (
      <blockquote
        className="border-l-2 border-accent pl-ds-4 italic text-neutral-300 my-ds-2"
        {...rest}
      >
        {children}
      </blockquote>
    );
  },
  hr(props) {
    return <hr className="hr border-0 my-ds-4" {...props} />;
  },
  a({ children, className, ...rest }) {
    return (
      <a className={cx("text-accent underline-offset-2 hover:underline", className)} {...rest}>
        {children}
      </a>
    );
  },
  table({ children, ...rest }) {
    return (
      <div className="overflow-x-auto my-ds-3">
        <table className="w-full text-sm" {...rest}>
          {children}
        </table>
      </div>
    );
  },
  tr({ children, ...rest }) {
    // `.hr`'s fading-rule technique is a background-gradient meant for a
    // thin standalone element, not a table row — so row separators here
    // use a plain `border-divider` bottom border instead.
    return (
      <tr className="border-b border-divider" {...rest}>
        {children}
      </tr>
    );
  },
  th({ children, ...rest }) {
    return (
      <th className="p-ds-2 text-left font-heading font-medium" {...rest}>
        {children}
      </th>
    );
  },
  td({ children, ...rest }) {
    return (
      <td className="p-ds-2 text-left" {...rest}>
        {children}
      </td>
    );
  },
  pre({ children }) {
    const { language, code } = extractCodeProps(children);
    return <CodeBlock code={code} language={language} />;
  },
  code({ className, children, ...rest }) {
    // Reached only for INLINE code — fenced code is intercepted by `pre` above.
    return (
      <code
        className={cx("rounded-sm bg-code-ground px-1 py-0.5 font-mono text-[0.9em] text-text", className)}
        {...rest}
      >
        {children}
      </code>
    );
  },
};

/**
 * Renders chat-message markdown: GFM (tables, strikethrough, task lists,
 * autolinks) and LaTeX math (`$inline$` / `$$block$$`, via `rehype-katex`)
 * on top of `react-markdown`, with fenced code routed through `CodeBlock`.
 */
export function Markdown({ content, className, ...rest }: MarkdownProps) {
  return (
    <div className={cx("font-body text-text text-sm", className)} {...rest}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Alias for `Markdown` — the rendering surface for a chat message's body. */
export { Markdown as MessageContent };
