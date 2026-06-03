import { Route } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/components/ui";
import type { Assignment } from "@/features/assignments/types/assignment.types";
import {
  ASSIGNMENT_STATUS_BADGE_VARIANT,
  ASSIGNMENT_STATUS_LABEL,
} from "@/features/assignments/lib/assignment-utils";

interface Props {
  assignment: Assignment;
  selected?: boolean;
  onClick: (id: string) => void;
}

export function AssignmentListItem({ assignment, selected, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selected]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick(assignment.id)}
      className={cn(
        "w-full text-left rounded-md border px-3 py-2.5 transition",
        "flex items-start gap-3",
        "hover:border-primary-300 hover:bg-primary-50/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        selected
          ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-300"
          : "border-neutral-200 bg-white",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          selected
            ? "bg-primary-100 text-primary-700"
            : "bg-neutral-100 text-neutral-600",
        )}
      >
        <Route className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-neutral-900">
              {assignment.label}
            </div>
            <div className="truncate text-xs text-neutral-500">
              {assignment.shipment_count} shipment
              {assignment.shipment_count === 1 ? "" : "s"}
              {assignment.clients.length > 0 &&
                ` • ${assignment.clients.slice(0, 2).join(", ")}${
                  assignment.clients.length > 2 ? "…" : ""
                }`}
            </div>
          </div>

          <Badge variant={ASSIGNMENT_STATUS_BADGE_VARIANT[assignment.status]}>
            {ASSIGNMENT_STATUS_LABEL[assignment.status]}
          </Badge>
        </div>
      </div>
    </button>
  );
}
