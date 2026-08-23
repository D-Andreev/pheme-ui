import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionDurations, MOTION_EASE } from "../../lib/motion";
import type { MotionConflictingProps } from "../../lib/motion";

export type CardElevation = "sm" | "md" | "lg" | "none";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, MotionConflictingProps> {
  /** Box-shadow token to apply. Defaults to `"sm"`. */
  elevation?: CardElevation;
  children?: ReactNode;
}

const elevationClasses: Record<CardElevation, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

/**
 * Generic surface shell — the structural basis for a chat message bubble,
 * a list card, or any other boxed content. No chat semantics yet: this PR
 * ships the shell only, per issue #2's clarified scope.
 */
export function Card({ elevation = "sm", className, children, onClick, onKeyDown, ...rest }: CardProps) {
  // A Card becomes interactive the moment a consumer wires up `onClick` —
  // hover/focus/press micro-interactions and keyboard activation switch on
  // together rather than needing a separate `clickable` prop to remember.
  const clickable = !!onClick;
  const durations = useMotionDurations();

  const classes = [
    "flex flex-col gap-ds-2 rounded-md bg-surface p-ds-3 text-text",
    "transition-colors duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
    clickable && "cursor-pointer hover:bg-text/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
    elevationClasses[elevation],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown: typeof onKeyDown = (event) => {
    if (clickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
    }
    onKeyDown?.(event);
  };

  return (
    <motion.div
      className={classes}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : onKeyDown}
      whileHover={clickable ? { scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      whileFocus={clickable ? { scale: 1.01 } : undefined}
      transition={{ duration: durations.fast, ease: MOTION_EASE.standard }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function CardTitle({ className, children, ...rest }: CardTitleProps) {
  const classes = ["font-heading font-medium text-[17px] leading-tight", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <p className={classes} {...rest}>
      {children}
    </p>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function CardBody({ className, children, ...rest }: CardBodyProps) {
  const classes = ["m-0 flex-1 text-[13px] opacity-80", className ?? ""].filter(Boolean).join(" ");
  return (
    <p className={classes} {...rest}>
      {children}
    </p>
  );
}
