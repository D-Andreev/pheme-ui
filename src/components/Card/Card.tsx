import type { HTMLAttributes, ReactNode } from "react";

export type CardElevation = "sm" | "md" | "lg" | "none";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
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
export function Card({ elevation = "sm", className, children, ...rest }: CardProps) {
  const classes = [
    "flex flex-col gap-ds-2 rounded-md bg-surface p-ds-3 text-text",
    elevationClasses[elevation],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
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
