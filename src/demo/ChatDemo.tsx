import { useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { Button } from "../components/Button";
import { MessageBubble } from "../components/MessageBubble";
import { EmptyThread } from "../components/EmptyThread";
import { Composer } from "../components/Composer";
import { ArtifactPanel } from "../components/ArtifactPanel";
import type { ArtifactMode } from "../components/ArtifactPanel";
import { Lightbox } from "../components/Lightbox";
import type { LightboxImage } from "../components/Lightbox";
import { cx } from "../lib/cx";
import {
  ALL_TRIGGERS,
  FALLBACK_TRIGGER,
  AssistantBlockView,
} from "./chatDemoTriggers";
import type { AssistantBlock, ArtifactSpec, Trigger } from "./chatDemoTriggers";

interface UserTurn {
  kind: "user";
  id: string;
  content: string;
}

interface AssistantTurn {
  kind: "assistant";
  id: string;
  trigger: Trigger;
  blocks: AssistantBlock[];
}

type ChatDemoMessage = UserTurn | AssistantTurn;

const HIGHLIGHT_SUGGESTIONS = ["help", "Show me a chart", "Explain some markdown", "Open an artifact"];

const BLOCK_GAP_MS = 450;
const TEXT_REVEAL_MS = 550;
const THINKING_REVEAL_MS = 900;
const TOOL_RUN_MS = 900;
const UPLOAD_MS = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Splits on non-letters and lowercases, so "Show me a chart" matches the "chart" alias. */
function wordsOf(input: string): string[] {
  return input.toLowerCase().match(/[a-z]+/g) ?? [];
}

function matchTrigger(input: string): Trigger | undefined {
  const words = wordsOf(input);
  return ALL_TRIGGERS.find((trigger) => trigger.aliases.some((alias) => words.includes(alias)));
}

export type ChatDemoProps = HTMLAttributes<HTMLDivElement>;

/**
 * Full end-to-end demo of the chat: a live send/receive loop over
 * `Composer`, with keyword-matched mock responses that show off the rest
 * of the showcase set (see `chatDemoTriggers.tsx` for the trigger list, or
 * type `help` in the running demo). Storybook-only — not exported from
 * `src/index.ts`.
 */
export function ChatDemo({ className, ...rest }: ChatDemoProps) {
  const [messages, setMessages] = useState<ChatDemoMessage[]>([]);
  const [value, setValue] = useState("");
  const [generating, setGenerating] = useState(false);
  const [artifact, setArtifact] = useState<(ArtifactSpec & { mode: ArtifactMode }) | null>(null);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  const mountedRef = useRef(true);
  const runIdRef = useRef(0);
  const idCounterRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  // Follow the newest message/block as the thread grows or streams in —
  // otherwise a multi-turn session leaves the reader stranded above the fold.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const nextId = useCallback((prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }, []);

  const openArtifact = useCallback((spec: ArtifactSpec) => {
    setArtifact({ ...spec, mode: "preview" });
  }, []);

  const appendBlock = useCallback((turnId: string, block: AssistantBlock) => {
    setMessages((prev) =>
      prev.map((m) => (m.kind === "assistant" && m.id === turnId ? { ...m, blocks: [...m.blocks, block] } : m)),
    );
  }, []);

  const patchBlock = useCallback((turnId: string, blockId: string, patch: Partial<AssistantBlock>) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.kind === "assistant" && m.id === turnId
          ? {
              ...m,
              // Same union-spread widening as in `playTurn` — the merge is a same-`type` patch.
              blocks: m.blocks.map((b) => (b.id === blockId ? ({ ...b, ...patch } as AssistantBlock) : b)),
            }
          : m,
      ),
    );
  }, []);

  const playTurn = useCallback(
    async (trigger: Trigger, existingTurnId?: string) => {
      const myRun = (runIdRef.current += 1);
      const isStale = () => !mountedRef.current || runIdRef.current !== myRun;

      const turnId = existingTurnId ?? nextId("assistant");
      if (existingTurnId) {
        setMessages((prev) => prev.map((m) => (m.kind === "assistant" && m.id === turnId ? { ...m, blocks: [] } : m)));
      } else {
        setMessages((prev) => [...prev, { kind: "assistant", id: turnId, trigger, blocks: [] }]);
      }
      setGenerating(true);

      for (const spec of trigger.blocks) {
        if (isStale()) return;
        await delay(BLOCK_GAP_MS);
        if (isStale()) return;

        const streamable = spec.type === "thinking" || spec.type === "text";
        // `AssistantBlock` is `AssistantBlockSpec & {...}` over a discriminated union — spreading a
        // union member here is provably correct (same `type` tag, extra fields only), but TS widens
        // the spread's `type` when combined with the sibling fields, so an assertion is needed.
        const block = {
          ...spec,
          id: nextId("block"),
          streaming: streamable ? true : undefined,
          toolStatus: spec.type === "tool" ? "running" : undefined,
          attachmentStatus: spec.type === "attachment" ? "uploading" : undefined,
          attachmentProgress: spec.type === "attachment" ? 45 : undefined,
        } as AssistantBlock;
        appendBlock(turnId, block);

        if (streamable) {
          await delay(spec.type === "thinking" ? THINKING_REVEAL_MS : TEXT_REVEAL_MS);
          if (isStale()) return;
          patchBlock(turnId, block.id, { streaming: false });
        } else if (spec.type === "tool") {
          await delay(TOOL_RUN_MS);
          if (isStale()) return;
          patchBlock(turnId, block.id, { toolStatus: spec.error ? "failed" : "success" });
        } else if (spec.type === "attachment") {
          await delay(UPLOAD_MS);
          if (isStale()) return;
          patchBlock(turnId, block.id, { attachmentStatus: "success", attachmentProgress: 100 });
        }
      }

      if (isStale()) return;
      setGenerating(false);
      trigger.onComplete?.({ openArtifact });
    },
    [appendBlock, patchBlock, nextId, openArtifact],
  );

  const handleSend = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || generating) return;
      setMessages((prev) => [...prev, { kind: "user", id: nextId("user"), content: text }]);
      setValue("");
      void playTurn(matchTrigger(text) ?? FALLBACK_TRIGGER);
    },
    [generating, nextId, playTurn],
  );

  const handleSubmit = useCallback(() => handleSend(value), [handleSend, value]);

  const retryTurn = useCallback((turn: AssistantTurn) => void playTurn(turn.trigger, turn.id), [playTurn]);

  // Interrupts the in-flight `playTurn` loop (its next `isStale()` check fails
  // once `runIdRef` no longer matches) and leaves whatever blocks already
  // streamed in as the final state — mirrors stopping a real generation.
  const handleStop = useCallback(() => {
    runIdRef.current += 1;
    setGenerating(false);
  }, []);

  const handleReset = useCallback(() => {
    runIdRef.current += 1;
    setMessages([]);
    setValue("");
    setGenerating(false);
    setArtifact(null);
    setLightbox(null);
  }, []);

  return (
    <div className={cx("flex h-[720px] flex-col bg-bg text-text", className)} {...rest}>
      <div className="flex shrink-0 items-center justify-between gap-ds-2 border-b border-divider px-ds-4 py-ds-3">
        <div>
          <p className="m-0 font-heading text-sm text-text">Pheme UI — Full Chat Demo</p>
          <p className="m-0 font-body text-xs text-neutral-400">
            Type a keyword (try <code>help</code>) to see a component in action.
          </p>
        </div>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 gap-ds-3 p-ds-4">
        <div className="flex min-w-0 flex-1 flex-col gap-ds-3">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyThread
                heading="Try the full Pheme chat demo"
                suggestions={HIGHLIGHT_SUGGESTIONS}
                onSuggestionSelect={handleSend}
              />
            ) : (
              <div className="flex flex-col gap-ds-4">
                {messages.map((message) =>
                  message.kind === "user" ? (
                    <MessageBubble
                      key={message.id}
                      content={message.content}
                      editable
                      onEdit={() => setValue(message.content)}
                    />
                  ) : (
                    <div key={message.id} className="flex flex-col gap-ds-3">
                      {message.blocks.map((block) => (
                        <AssistantBlockView
                          key={block.id}
                          block={block}
                          onRetry={() => retryTurn(message)}
                          onFollowUpSelect={handleSend}
                          onExpandImage={(image) => setLightbox({ images: [image], index: 0 })}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <Composer
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            generating={generating}
            onStop={handleStop}
            placeholder="Send a message... (try `help`)"
          />
        </div>

        {artifact ? (
          <div className="flex w-full shrink-0 flex-col gap-ds-2 sm:w-[380px]">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setArtifact(null)}>
                Close
              </Button>
            </div>
            <ArtifactPanel
              className="flex-1"
              title={artifact.title}
              version={artifact.version}
              mode={artifact.mode}
              onModeChange={(mode) => setArtifact((prev) => (prev ? { ...prev, mode } : prev))}
              code={artifact.code}
              language={artifact.language}
            >
              <h2 className="font-heading text-base">{artifact.title}</h2>
              <p className="mt-ds-2 text-sm opacity-80">
                A generated document, rendered here in preview mode. Switch to Code to see the source.
              </p>
            </ArtifactPanel>
          </div>
        ) : null}
      </div>

      {lightbox ? (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
        />
      ) : null}
    </div>
  );
}
