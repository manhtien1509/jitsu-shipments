const INVALID = "—";

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Compact format for list items, badges, etc.
 * Example: "Mar 15"
 */
export function formatDateShort(value?: string | null): string {
  const d = toDate(value);
  if (!d) return INVALID;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Full format for detail panels and forms.
 * Example: "Mar 15, 2025, 02:30 PM"
 */
export function formatDateLong(value?: string | null): string {
  const d = toDate(value);
  if (!d) return INVALID;

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateInputValue(value: string): string {
  return new Date(value).toISOString();
}
