import { PackageOpen } from "lucide-react";
import { EmptyState, SkeletonRow } from "@/shared/components/ui";
import { useShipment } from "../../hooks/useShipments";
import { useShipmentsStore } from "../../store/shipments.store";
import { ShipmentMap } from "@/shared/components/map/ShipmentMap";
import { ShipmentDetailHeader } from "./ShipmentDetailHeader";
import { ShipmentDetailInfo } from "./ShipmentDetailInfo";

interface Props {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
        onEdit={onEdit ? () => onEdit(data.id) : undefined}
        onDelete={onDelete ? () => onDelete(data.id) : undefined}
      />

      <div className="py-4 border-t">
        <h3 className="text-sm font-medium mb-2">Location</h3>
        <ShipmentMap lat={data.lat} lng={data.lng} label={data.label} />
      </div>

      <ShipmentDetailInfo shipment={data} />
    </div>
  );
}
