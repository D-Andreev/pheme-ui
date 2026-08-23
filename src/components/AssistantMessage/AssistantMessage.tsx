import type { HTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Markdown } from "../Markdown/Markdown";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface AssistantMessageAction {
  /** Visible label for the action button. */
  label: string;
  /** Called when the action button is activated. */
  onClick: () => void;
}

export interface AssistantMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** Raw markdown content of the assistant's response. */
  content: string;
  /** Shows a blinking caret after the content while the response is still arriving. */
  streaming?: boolean;
  /** Actions rendered below the content (e.g. Copy, Retry, Good, Bad). */
  actions?: AssistantMessageAction[];
}

/**
 * The assistant's chat message — flush-left markdown flow, no bubble
 * background, with an optional streaming caret and a reserved-height
 * actions row so hover/appearing actions never shift surrounding layout.
 */
export function AssistantMessage({
  content,
  streaming = false,
  actions = [],
  className,
  ...rest
}: AssistantMessageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      tabIndex={0}
      className={cx(
        "max-w-prose rounded-md text-text",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
        className,
      )}
      {...rest}
    >
      <Markdown content={content} />
      {streaming ? (
        <motion.span
          aria-hidden="true"
          data-testid="streaming-caret"
          className="ml-0.5 inline-block h-[1em] w-[2px] align-middle bg-text"
          animate={reducedMotion ? { opacity: 0.6 } : { opacity: [1, 1, 0, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 1, times: [0, 0.45, 0.5, 1], repeat: Infinity, ease: "easeInOut" }
          }
        />
      ) : null}
      <div data-testid="assistant-message-actions" className="mt-ds-2 flex min-h-9 items-center gap-ds-1">
        {actions.map((action) => (
          <Button key={action.label} variant="ghost" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
