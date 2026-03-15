import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format ISO date string → "12 Jan 2025" */
export function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(value));
}

/** Format ISO datetime → "12 Jan 2025, 14:30" */
export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}

/** Escape a value for CSV export */
export function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Trigger a CSV download in the browser */
export function downloadCsv(rows: string[][], filename: string): void {
  const csv = rows.map(row => row.map(v => escapeCsv(String(v))).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Parse conversation messages safely from JSON or array */
export function parseMessages(raw: unknown): Array<{ role: "user" | "assistant"; content: string }> {
  const normalize = (arr: unknown[]): Array<{ role: "user" | "assistant"; content: string }> =>
    arr
      .filter(item => item && typeof item === "object")
      .map(item => {
        const m = item as { role?: unknown; content?: unknown };
        return { role: m.role === "assistant" ? "assistant" as const : "user" as const, content: typeof m.content === "string" ? m.content : "" };
      })
      .filter(m => m.content.trim().length > 0);

  if (Array.isArray(raw)) return normalize(raw);
  if (typeof raw === "string") {
    try { const p = JSON.parse(raw); if (Array.isArray(p)) return normalize(p); } catch {}
  }
  return [];
}

/** Get conversation preview from first user message */
export function conversationPreview(messages: unknown, maxLen = 80): string {
  const msgs = parseMessages(messages);
  const first = msgs.find(m => m.role === "user");
  const text = first?.content ?? msgs[0]?.content ?? "No messages";
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}
