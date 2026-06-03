import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  mobileView?: "left" | "right";
  leftClassName?: string;
  rightClassName?: string;
}

export function SplitLayout({
  left,
  right,
  mobileView = "left",
  leftClassName,
  rightClassName,
}: SplitLayoutProps) {
  return (
    <div className="h-full md:flex">
      <aside
        className={cn(
          "md:w-95 md:shrink-0 md:border-r border-neutral-200 bg-white overflow-y-auto h-full",
          mobileView === "left" ? "block" : "hidden md:block",
          leftClassName,
        )}
      >
        {left}
      </aside>
      <section
        className={cn(
          "flex-1 overflow-y-auto bg-neutral-50 h-full",
          mobileView === "right" ? "block" : "hidden md:block",
          rightClassName,
        )}
      >
        {right}
      </section>
    </div>
  );
}
