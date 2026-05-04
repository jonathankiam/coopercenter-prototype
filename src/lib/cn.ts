import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind class names with proper conflict resolution.
 * Used by shadcn-generated components — kept separate from `lib/utils.ts`
 * (which holds business-logic helpers) so the two don't fight.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
