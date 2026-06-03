import { STATUS_LABEL } from "../../lib/shipment.utils";
import type { Shipment, ShipmentStatus } from "../../types/shipment.types";
import { ShipmentListItem } from "./ShipmentListItem";

interface Props {
  status: ShipmentStatus;
  shipments: Shipment[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export function ShipmentListGroup({
  status,
  shipments,
  selectedId,
  onSelect,
}: Props) {
  if (shipments.length === 0) return null;

  return (
    <section>
      <header className="flex items-center justify-between px-1 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {STATUS_LABEL[status]}
        </h3>
        <span className="text-xs text-neutral-400">{shipments.length}</span>
      </header>

      <div className="flex flex-col gap-1.5">
        {shipments.map((s) => (
          <ShipmentListItem
            key={s.id}
            shipment={s}
            selected={s.id === selectedId}
            onClick={onSelect}
          />
        ))}
      </div>
    </section>
  );
}