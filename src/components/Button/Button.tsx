import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionDurations, MOTION_EASE } from "../../lib/motion";
import type { MotionConflictingProps } from "../../lib/motion";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictingProps> {
  /** Visual style. Defaults to `"primary"`. */
  variant?: ButtonVariant;
  /** Renders as a 36x36 icon-only button (no text padding). */
  icon?: boolean;
  /** Stretches the button to fill its container's width. */
  block?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "text-accent border-accent hover:bg-accent/10 active:bg-accent/20",
  secondary:
    "border-divider hover:bg-text/[0.07] active:bg-text/[0.14]",
  ghost: "text-accent hover:bg-accent/10 active:bg-accent/20",
};

const paddingXClasses: Record<ButtonVariant, string> = {
  primary: "px-[calc(var(--space-3)*1.2)]",
  secondary: "px-[calc(var(--space-3)*1.2)]",
  ghost: "px-ds-1",
};

/**
 * Foundational button primitive. Structure + styling only — no chat logic.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", icon = false, block = false, className, children, ...rest },
    ref,
  ) => {
    const durations = useMotionDurations();
    const classes = [
      "inline-flex items-center justify-center gap-1.5",
      "font-heading font-medium text-sm leading-tight text-text",
      "bg-transparent border border-transparent rounded-md",
      "cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed",
      "transition-colors duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
      icon ? "h-9 w-9 p-0" : `${paddingXClasses[variant]} py-ds-2`,
      block ? "w-full mt-ds-2" : "",
      variantClasses[variant],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.button
        ref={ref}
        type="button"
        className={classes}
        whileHover={rest.disabled ? undefined : { scale: 1.03 }}
        whileTap={rest.disabled ? undefined : { scale: 0.97 }}
        whileFocus={rest.disabled ? undefined : { scale: 1.03 }}
        transition={{ duration: durations.fast, ease: MOTION_EASE.standard }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
