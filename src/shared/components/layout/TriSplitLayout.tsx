import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface TriSplitLayoutProps {
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
  showRight?: boolean;
  mobileView?: "left" | "middle" | "right";
  leftClassName?: string;
  middleClassName?: string;
  rightClassName?: string;
}

export function TriSplitLayout({
  left,
  middle,
  right,
  showRight = true,
  mobileView = "left",
  leftClassName,
  middleClassName,
  rightClassName,
}: TriSplitLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div
        className={cn(
          "flex-col overflow-hidden border-r",
          // mobile
          mobileView === "left" ? "flex w-full" : "hidden",
          // tablet+
          "md:flex md:w-70 md:shrink-0",
          // desktop
          "lg:w-80",
          leftClassName,
        )}
      >
        {left}
      </div>

      <div
        className={cn(
          "flex-col overflow-hidden border-r",
          // mobile
          mobileView === "middle" ? "flex w-full" : "hidden",
          "md:flex md:flex-1 md:min-w-0",
          "lg:flex-none lg:w-105 xl:w-115 lg:shrink-0",
          middleClassName,
        )}
      >
        {middle}
      </div>

      {showRight && (
        <div
          className={cn(
            "flex-col overflow-hidden",
            // mobile
            mobileView === "right" ? "flex w-full" : "hidden",
            "md:hidden",
            "lg:flex lg:flex-1 lg:min-w-0",
            rightClassName,
          )}
        >
          {right}
        </div>
      )}
    </div>
  );
}
