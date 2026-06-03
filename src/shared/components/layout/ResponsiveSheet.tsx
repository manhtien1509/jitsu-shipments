// shared/components/layout/ResponsiveSheet.tsx
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface ResponsiveSheetProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "bottom" | "left";
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const sideStyles = {
  right: {
    container: "justify-end",
    panel: "h-full w-full max-w-md animate-slide-in-right rounded-l-lg",
  },
  left: {
    container: "justify-start",
    panel: "h-full w-full max-w-md animate-slide-in-left rounded-r-lg",
  },
  bottom: {
    container: "items-end",
    panel: "w-full max-h-[90vh] animate-slide-in-up rounded-t-lg",
  },
};

export function ResponsiveSheet({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
}: ResponsiveSheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const styles = sideStyles[side];

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-9999 flex bg-black/50 animate-fade-in",
        styles.container,
      )}
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative bg-white shadow-xl flex flex-col",
          styles.panel,
          className,
        )}
      >
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {children && (
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        )}

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
