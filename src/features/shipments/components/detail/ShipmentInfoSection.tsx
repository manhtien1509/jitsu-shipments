import type { Shipment } from "@/features/shipments/types/shipment.types";

interface Props {
  shipment: Shipment;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-neutral-100 last:border-0">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="col-span-2 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export function ShipmentInfoSection({ shipment }: Props) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        General
      </h3>
      <dl>
        <InfoRow label="Client" value={shipment.client_name} />
        <InfoRow label="Label" value={shipment.label || "—"} />
        <InfoRow label="Warehouse" value={shipment.warehouse_id} />
      </dl>
    </section>
  );
}
