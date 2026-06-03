import { Package } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import { StatusBadge } from "../common/StatusBadge";
import { useEffect, useRef } from "react";
import { formatDateShort } from "@/shared/lib/date";

interface Props {
  shipment: Shipment;
  selected?: boolean;
  onClick: (id: string) => void;
}

export function ShipmentListItem({ shipment, selected, onClick }: Props) {
  const arrival = formatDateShort(shipment.arrival_date);

  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected) {
      // Only scroll if item is OUT of viewport
      const rect = ref.current?.getBoundingClientRect();
      const isVisible =
        rect && rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selected]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick(shipment.id)}
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
        <Package className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-neutral-900">
              {shipment.client_name}
            </div>
            <div className="truncate text-xs text-neutral-500">
              {shipment.label || "—"}
            </div>
          </div>

          <StatusBadge status={shipment.status} />
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
          {arrival && <span className="shrink-0">Arrived {arrival}</span>}
        </div>
      </div>
    </button>
  );
}
