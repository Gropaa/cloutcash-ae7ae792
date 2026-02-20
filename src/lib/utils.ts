import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/username.ts
export function formatUsername(username: string): string {
  return '@' + username.replace(/^@+/, '');
}

