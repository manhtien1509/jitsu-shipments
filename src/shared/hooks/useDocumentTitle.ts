import { useEffect } from "react";

const DEFAULT_SUFFIX = "Jitsu Shipments";

/**
 * Sets `document.title` while the component is mounted,
 * and restores the previous title on unmount.
 *
 * @example
 *   useDocumentTitle("Assignments");
 *   // → "Assignments · Jitsu Shipments"
 *
 *   useDocumentTitle("Assignments", { suffix: null });
 *   // → "Assignments"
 */
export function useDocumentTitle(
  title: string | undefined | null,
  options: { suffix?: string | null } = {},
) {
  const { suffix = DEFAULT_SUFFIX } = options;

  useEffect(() => {
    if (!title) return;

    const previous = document.title;
    document.title = suffix ? `${title} · ${suffix}` : title;

    return () => {
      document.title = previous;
    };
  }, [title, suffix]);
}
