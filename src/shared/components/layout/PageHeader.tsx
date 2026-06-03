import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  actions,
  showBack,
  onBack,
}: PageHeaderProps) {
  return (
    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-200 bg-white flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 -ml-1 rounded hover:bg-neutral-100"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base md:text-lg font-semibold text-neutral-900 truncate">
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
