import { Package, PackageOpen } from "lucide-react";
import { EmptyState, SkeletonRow } from "@/shared/components/ui";
import { formatDateShort } from "@/shared/lib/date";
import { cn } from "@/shared/lib/cn";
import { StatusBadge } from "@/features/shipments/components/common/StatusBadge";
import type { Shipment } from "@/features/shipments/types/shipment.types";

interface Props {
  shipments: Shipment[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AssignmentShipmentsList({
  shipments,
  isLoading,
  selectedId,
  onSelect,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="h-6 w-6" />}
        title="No shipments"
        description="This assignment has no shipments yet."
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {shipments.map((s) => {
        const selected = selectedId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-full text-left rounded-md border px-3 py-2 transition",
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
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                selected
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-600",
              )}
            >
              <Package className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900">
                    {s.client_name}
                  </div>
                  <div className="truncate text-xs text-neutral-500">
                    {s.label}
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                Arrived {formatDateShort(s.arrival_date)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
