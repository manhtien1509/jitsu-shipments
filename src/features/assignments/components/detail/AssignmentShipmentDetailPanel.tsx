import { Pencil, PackageOpen, Trash2 } from "lucide-react";
import { lazy, Suspense } from "react";

import { Button, EmptyState } from "@/shared/components/ui";
import { ShipmentDetailInfo } from "@/features/shipments/components/detail/ShipmentDetailInfo";
import { Badge } from "@/shared/components/ui";
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
} from "@/features/shipments/lib/shipment-utils";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import { LoadingFallback } from "@/shared/components/feedback/LoadingFallback";

const AssignmentRouteMap = lazy(() =>
  import("@/shared/components/map/AssignmentRouteMap").then((m) => ({
    default: m.AssignmentRouteMap,
  })),
);

interface Props {
  shipment: Shipment | null;
  assignmentShipments: Shipment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AssignmentShipmentDetailPanel({
  shipment,
  assignmentShipments,
  onEdit,
  onDelete,
}: Props) {
  if (!shipment) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<PackageOpen className="h-8 w-8" />}
          title="Select a shipment"
          description="Click a shipment from the assignment to view its route."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-neutral-900">
              {shipment?.client_name}
            </h2>
            <Badge variant={STATUS_BADGE_VARIANT[shipment?.status]}>
              {STATUS_LABEL[shipment?.status]}
            </Badge>
          </div>
          <div className="mt-0.5 truncate text-xs text-neutral-500">
            {shipment?.label} • {shipment?.id}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => onEdit(shipment?.id)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(shipment?.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Map */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900">
            Route ({assignmentShipments.length} stops)
          </h3>

          <Suspense fallback={<LoadingFallback />}>
            <AssignmentRouteMap
              shipments={assignmentShipments}
              selectedShipmentId={shipment?.id}
              className="h-72 overflow-hidden rounded-md border border-neutral-200"
            />
          </Suspense>
        </div>

        {/* Info */}
        <ShipmentDetailInfo shipment={shipment} />
      </div>
    </div>
  );
}
