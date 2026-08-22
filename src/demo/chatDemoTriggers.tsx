import type { ReactNode } from "react";
import { AssistantMessage } from "../components/AssistantMessage";
import { ErrorMessage } from "../components/ErrorMessage";
import { ThinkingBlock } from "../components/ThinkingBlock";
import { ToolCallCard } from "../components/ToolCallCard";
import type { ToolCallStatus } from "../components/ToolCallCard";
import { CodeBlock } from "../components/CodeBlock";
import { DiffBlock } from "../components/DiffBlock";
import { JsonViewer } from "../components/JsonViewer";
import { MathBlock } from "../components/MathBlock";
import { ImagePreview } from "../components/ImagePreview";
import { ImageGrid } from "../components/ImageGrid";
import type { LightboxImage } from "../components/Lightbox";
import { VideoEmbed } from "../components/VideoEmbed";
import { AttachmentCard } from "../components/AttachmentCard";
import type { AttachmentCardStatus } from "../components/AttachmentCard";
import { Citation, SourceList } from "../components/Citation";
import type { Source } from "../components/Citation";
import { WebSearchCard } from "../components/WebSearchCard";
import type { WebSearchResult } from "../components/WebSearchCard";
import { Chart } from "../components/Chart";
import type { ChartDatum } from "../components/Chart";
import { SuggestedFollowUps } from "../components/SuggestedFollowUps";

/**
 * Static description of one block in an assistant turn. The engine in
 * `ChatDemo.tsx` turns each spec into a runtime `AssistantBlock` (adding an
 * id and, for a few types, transient reveal state) as it plays a turn.
 */
export type AssistantBlockSpec =
  | { type: "thinking"; content: string }
  | { type: "text"; content: string }
  | { type: "error"; message: string }
  | { type: "tool"; name: string; args: unknown; result?: unknown; error?: string }
  | { type: "code"; code: string; language?: string; filename?: string; showLineNumbers?: boolean }
  | { type: "diff"; diff: string; filename?: string }
  | { type: "json"; name?: string; data: unknown; defaultExpanded?: boolean | number }
  | { type: "math"; math: string; display?: boolean }
  | { type: "image"; src: string; alt?: string }
  | { type: "images"; images: LightboxImage[] }
  | { type: "video"; src: string; poster?: string }
  | { type: "attachment"; filename: string; size?: string }
  | { type: "citation"; lead: string; sources: Source[] }
  | { type: "websearch"; query: string; results: WebSearchResult[] }
  | { type: "chart"; data: ChartDatum[]; seriesLabels?: [string, string] }
  | { type: "followups"; suggestions: string[] };

/** A block as it exists in state — spec plus an id and transient reveal state. */
export type AssistantBlock = AssistantBlockSpec & {
  id: string;
  /** Only meaningful for `"thinking"` / `"text"` — drives the streaming caret. */
  streaming?: boolean;
  /** Only meaningful for `"tool"` — starts `"running"`, flips once resolved. */
  toolStatus?: ToolCallStatus;
  /** Only meaningful for `"attachment"` — starts `"uploading"`, flips to `"success"`. */
  attachmentStatus?: AttachmentCardStatus;
  attachmentProgress?: number;
};

export interface ArtifactSpec {
  title: string;
  version?: string;
  code: string;
  language?: string;
}

export interface TriggerHelpers {
  openArtifact: (artifact: ArtifactSpec) => void;
}

export interface Trigger {
  /** Primary keyword, shown in the help list and used as the canonical name. */
  id: string;
  /** Words that route a message to this trigger (matched whole-word, case-insensitive). */
  aliases: string[];
  /** One-line description shown by the `help` trigger. */
  description: string;
  blocks: AssistantBlockSpec[];
  /** Runs once every block in the turn has finished revealing. */
  onComplete?: (helpers: TriggerHelpers) => void;
}

const tsSnippet = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

const diffText = `--- a/greet.ts
+++ b/greet.ts
@@ -1,3 +1,3 @@
 export function greet(name) {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }`;

function makeImages(seedPrefix: string, count: number): LightboxImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `https://picsum.photos/seed/${seedPrefix}-${i}/400/400`,
    alt: `Image ${i + 1}`,
  }));
}

const artifactCode = `# Onboarding

1. Install dependencies with \`pnpm install\`.
2. Run \`pnpm storybook\` to browse every component.
3. Type \`help\` in this demo to see what else you can try.
`;

/** Every trigger except `help`, which is generated from this list below. */
export const TRIGGERS: Trigger[] = [
  {
    id: "markdown",
    aliases: ["markdown", "formatting", "format"],
    description: "Rich markdown — headings, lists, a table, and inline styling.",
    blocks: [
      {
        type: "text",
        content: [
          "## Nocturne at a glance",
          "",
          "A **dark-first** design system with a small, consistent token set.",
          "",
          "- Colors resolve through CSS custom properties",
          "- Spacing uses the `ds-*` scale",
          "- Components stay flush with house style",
          "",
          "| Token | Value |",
          "| --- | --- |",
          "| `--color-accent` | `#9184d9` |",
          "| `--radius-md` | `8px` |",
          "",
          "> Try `code`, `diff`, `math`, or `json` next for more building blocks.",
        ].join("\n"),
      },
    ],
  },
  {
    id: "thinking",
    aliases: ["thinking", "reasoning", "think"],
    description: "Watch Pheme think before it answers.",
    blocks: [
      {
        type: "thinking",
        content:
          "The user wants to see the thinking block in action. Let me keep it " +
          "short and concrete, then land on a one-line answer.",
      },
      {
        type: "text",
        content: "Done thinking — the collapsible block above is `ThinkingBlock`.",
      },
    ],
  },
  {
    id: "tool",
    aliases: ["tool", "toolcall", "tools"],
    description: "A tool call running, then resolving with a result.",
    blocks: [
      {
        type: "tool",
        name: "search_docs",
        args: { query: "streaming caret", scope: "components" },
        result: { matches: 2, files: ["AssistantMessage.tsx", "Composer.tsx"] },
      },
      {
        type: "text",
        content: "Found two references — see the tool call above for the exact files.",
      },
    ],
  },
  {
    id: "error",
    aliases: ["error", "fail", "broken"],
    description: "A simulated failure with a retry action.",
    blocks: [{ type: "error", message: "The model timed out generating a response." }],
  },
  {
    id: "code",
    aliases: ["code", "snippet"],
    description: "A syntax-highlighted code block.",
    blocks: [
      { type: "text", content: "Here's a small helper:" },
      { type: "code", code: tsSnippet, language: "typescript", filename: "greet.ts", showLineNumbers: true },
    ],
  },
  {
    id: "diff",
    aliases: ["diff", "changes"],
    description: "A unified diff.",
    blocks: [
      { type: "text", content: "Here's the change:" },
      { type: "diff", filename: "greet.ts", diff: diffText },
    ],
  },
  {
    id: "json",
    aliases: ["json", "data"],
    description: "An expandable JSON viewer.",
    blocks: [
      { type: "text", content: "Here's the raw response:" },
      {
        type: "json",
        name: "result",
        data: { id: "msg_01", role: "assistant", tokens: 128, metadata: { model: "claude", streaming: false } },
        defaultExpanded: 1,
      },
    ],
  },
  {
    id: "math",
    aliases: ["math", "equation", "formula"],
    description: "Rendered math via KaTeX.",
    blocks: [
      { type: "text", content: "The classic:" },
      { type: "math", math: "E = mc^2", display: true },
    ],
  },
  {
    id: "image",
    aliases: ["image", "photo", "picture"],
    description: "A single image preview you can expand.",
    blocks: [{ type: "image", src: "https://picsum.photos/seed/pheme-demo-1/640/360", alt: "A generated landscape" }],
  },
  {
    id: "images",
    aliases: ["images", "gallery", "grid"],
    description: "An image grid with a built-in lightbox.",
    blocks: [{ type: "images", images: makeImages("pheme-demo-grid", 4) }],
  },
  {
    id: "video",
    aliases: ["video", "clip"],
    description: "An embedded, controllable video.",
    blocks: [
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        poster: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower-poster.jpg",
      },
    ],
  },
  {
    id: "attachment",
    aliases: ["attachment", "file", "upload"],
    description: "A file upload, from progress to done.",
    blocks: [{ type: "attachment", filename: "release-notes.pdf", size: "1.8 MB" }],
  },
  {
    id: "sources",
    aliases: ["sources", "citation", "citations"],
    description: "Inline citations with a source list.",
    blocks: [
      {
        type: "citation",
        lead: "Nocturne draws on some prior art:",
        sources: [
          { index: 1, title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
          { index: 2, title: "The Nocturne Design System", url: "https://pheme.example.com/docs/nocturne" },
        ],
      },
    ],
  },
  {
    id: "search",
    aliases: ["search", "websearch"],
    description: "A web search result card.",
    blocks: [
      { type: "text", content: "Let me check the web —" },
      {
        type: "websearch",
        query: "nocturne design system chat components",
        results: [
          {
            title: "Nocturne design system — overview",
            url: "https://pheme.example.com/docs/nocturne",
            snippet: "A dark-first design system for chat interfaces, with tokens for color, spacing, and motion.",
          },
          {
            title: "Building accessible chat UIs",
            url: "https://developer.example.com/articles/accessible-chat",
            snippet: "Patterns for keyboard navigation, focus management, and screen-reader support.",
          },
        ],
      },
    ],
  },
  {
    id: "chart",
    aliases: ["chart", "graph", "stats"],
    description: "A two-series bar chart.",
    blocks: [
      { type: "text", content: "Here's the trend:" },
      {
        type: "chart",
        data: [
          { label: "Mon", a: 12, b: 18 },
          { label: "Tue", a: 20, b: 14 },
          { label: "Wed", a: 8, b: 26 },
          { label: "Thu", a: 24, b: 22 },
          { label: "Fri", a: 16, b: 30 },
        ],
        seriesLabels: ["Baseline", "This week"],
      },
    ],
  },
  {
    id: "followups",
    aliases: ["followups", "suggestions", "related"],
    description: "Suggested follow-up questions.",
    blocks: [
      { type: "text", content: "Happy to go deeper on any of these:" },
      { type: "followups", suggestions: ["Show me a chart", "Explain some markdown", "Open an artifact"] },
    ],
  },
  {
    id: "artifact",
    aliases: ["artifact", "artifacts", "document"],
    description: "Opens the split-view artifact panel.",
    blocks: [{ type: "text", content: "Opening `onboarding.md` in the artifact panel →" }],
    onComplete: ({ openArtifact }) =>
      openArtifact({ title: "onboarding.md", version: "v1", code: artifactCode, language: "markdown" }),
  },
];

/** Fallback trigger used when nothing in `TRIGGERS` matches the input. */
export const FALLBACK_TRIGGER: Trigger = {
  id: "fallback",
  aliases: [],
  description: "",
  blocks: [
    {
      type: "text",
      content: "I didn't catch a trigger in that — type `help` to see everything you can try.",
    },
  ],
};

/** Synthesized from `TRIGGERS` so the list is never out of sync with `help`. */
export const HELP_TRIGGER: Trigger = {
  id: "help",
  aliases: ["help", "commands"],
  description: "Lists every trigger keyword.",
  blocks: [
    {
      type: "text",
      content: [
        "Here's everything you can try — type any of these keywords:",
        "",
        ...TRIGGERS.map((trigger) => `- \`${trigger.id}\` — ${trigger.description}`),
      ].join("\n"),
    },
  ],
};

/** Every trigger, including `help` — used for keyword matching. */
export const ALL_TRIGGERS: Trigger[] = [...TRIGGERS, HELP_TRIGGER];

export interface AssistantBlockViewProps {
  block: AssistantBlock;
  onRetry: () => void;
  onFollowUpSelect: (suggestion: string) => void;
  onExpandImage: (image: LightboxImage) => void;
}

/** Renders one runtime block via the matching pheme-ui component. */
export function AssistantBlockView({ block, onRetry, onFollowUpSelect, onExpandImage }: AssistantBlockViewProps): ReactNode {
  switch (block.type) {
    case "thinking":
      return <ThinkingBlock content={block.content} streaming={block.streaming} defaultExpanded />;
    case "text":
      return (
        <AssistantMessage
          content={block.content}
          streaming={block.streaming}
          actions={block.streaming ? [] : [{ label: "Copy", onClick: () => void navigator.clipboard?.writeText(block.content) }]}
        />
      );
    case "error":
      return <ErrorMessage message={block.message} onRetry={onRetry} />;
    case "tool":
      return (
        <ToolCallCard
          name={block.name}
          args={block.args}
          status={block.toolStatus ?? "running"}
          result={block.result}
          error={block.error}
          defaultExpanded
        />
      );
    case "code":
      return (
        <CodeBlock
          code={block.code}
          language={block.language}
          filename={block.filename}
          showLineNumbers={block.showLineNumbers}
        />
      );
    case "diff":
      return <DiffBlock diff={block.diff} filename={block.filename} />;
    case "json":
      return <JsonViewer name={block.name} data={block.data} defaultExpanded={block.defaultExpanded} />;
    case "math":
      return <MathBlock math={block.math} display={block.display} />;
    case "image":
      return (
        <ImagePreview
          src={block.src}
          alt={block.alt}
          onExpand={() => onExpandImage({ src: block.src, alt: block.alt })}
        />
      );
    case "images":
      return <ImageGrid images={block.images} />;
    case "video":
      return <VideoEmbed src={block.src} poster={block.poster} />;
    case "attachment":
      return (
        <AttachmentCard
          filename={block.filename}
          size={block.size}
          status={block.attachmentStatus ?? "uploading"}
          progress={block.attachmentProgress}
        />
      );
    case "citation":
      return (
        <div className="flex flex-col gap-ds-2">
          <p className="m-0 font-body text-sm text-text">
            {block.lead} {block.sources.map((source) => <Citation key={source.index} index={source.index} />)}
          </p>
          <SourceList sources={block.sources} />
        </div>
      );
    case "websearch":
      return <WebSearchCard query={block.query} results={block.results} />;
    case "chart":
      return <Chart data={block.data} seriesLabels={block.seriesLabels} />;
    case "followups":
      return <SuggestedFollowUps suggestions={block.suggestions} onSelect={onFollowUpSelect} />;
    default:
      return null;
  }
}
