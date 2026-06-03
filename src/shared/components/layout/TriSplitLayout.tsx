import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface Props {
  left: ReactNode;
  middle: ReactNode;
  right?: ReactNode;
  showRight?: boolean;
  leftClassName?: string;
  middleClassName?: string;
  rightClassName?: string;
}

export function TriSplitLayout({
  left,
  middle,
  right,
  showRight = true,
  leftClassName,
  middleClassName,
  rightClassName,
}: Props) {
  return (
    <div className="flex h-full">
      <aside
        className={cn(
          "w-80 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white",
          leftClassName,
        )}
      >
        {left}
      </aside>
      <section
        className={cn(
          "w-96 shrink-0 overflow-y-auto border-r border-neutral-200 bg-neutral-50",
          middleClassName,
        )}
      >
        {middle}
      </section>
      {showRight && (
        <section
          className={cn("flex-1 overflow-y-auto bg-neutral-50", rightClassName)}
        >
          {right}
        </section>
      )}
    </div>
  );
}
