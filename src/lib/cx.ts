/**
 * Joins conditional class names, dropping falsy values. Shared by every
 * component under `src/components` — see `Button`/`Card` for the inline
 * `.filter(Boolean).join(" ")` precedent this factors out.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
