import { PackageOpen } from "lucide-react";
import { lazy, Suspense } from "react";
import { EmptyState, SkeletonRow } from "@/shared/components/ui";
import { useShipment } from "@/features/shipments/api/useShipments";
import { useShipmentsStore } from "@/features/shipments/store/shipments.store";
import { ShipmentDetailHeader } from "./ShipmentDetailHeader";
import { ShipmentDetailInfo } from "./ShipmentDetailInfo";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import { LoadingFallback } from "@/shared/components/feedback/LoadingFallback";

const ShipmentMap = lazy(() =>
  import("@/shared/components/map/ShipmentMap").then((m) => ({
    default: m.ShipmentMap,
  })),
);

interface Props {
  onEdit?: (shipment: Shipment) => void;
  onDelete?: (shipment: Shipment) => void;
}

export function ShipmentDetailPanel({ onEdit, onDelete }: Props) {
  const selectedId = useShipmentsStore((s) => s.selectedId);
  const { data, isLoading, isError } = useShipment(selectedId);

  if (!selectedId) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<PackageOpen className="h-12 w-12" />}
          title="No shipment selected"
          description="Choose a shipment from the list to view its details."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow />
          </div>
          <SkeletonRow />
        </div>
        <div className="space-y-2 pt-4">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
        <div className="space-y-2 pt-4">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<PackageOpen className="h-12 w-12 text-danger-500" />}
          title="Failed to load shipment"
          description="Something went wrong while loading details."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <ShipmentDetailHeader
        shipment={data}
        onEdit={onEdit ? () => onEdit(data) : undefined}
        onDelete={onDelete ? () => onDelete(data) : undefined}
      />

      <div className="py-4 border-t">
        <h3 className="text-sm font-medium mb-2">Location</h3>
        <Suspense fallback={<LoadingFallback />}>
          <ShipmentMap lat={data.lat} lng={data.lng} label={data.label} />
        </Suspense>
      </div>

      <ShipmentDetailInfo shipment={data} />
    </div>
  );
}
