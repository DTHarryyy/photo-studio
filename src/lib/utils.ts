/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx + tailwind-merge for projects
 * where class conflicts are managed by consistent component APIs.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
