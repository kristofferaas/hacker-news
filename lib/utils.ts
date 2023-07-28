import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Build a query string from an object
export const qs = (obj: Record<string, string | number | boolean>) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");
