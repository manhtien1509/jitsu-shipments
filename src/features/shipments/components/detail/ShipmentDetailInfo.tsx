import type { ReactNode } from "react";
import { formatDateLong } from "@/shared/lib/date";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import { StatusBadge } from "../common/StatusBadge";

interface Props {
  shipment: Shipment;
}

export function ShipmentDetailInfo({ shipment }: Props) {
  return (
    <div className="space-y-6">
      <Section title="General">
        <InfoRow label="Shipment ID" value={shipment.id} />
        <InfoRow label="Client Name" value={shipment.client_name} />
        <InfoRow label="Label" value={shipment.label || "—"} />
        <InfoRow
          label="Status"
          value={<StatusBadge status={shipment.status} />}
        />
        <InfoRow label="Warehouse" value={shipment.warehouse_id} />
      </Section>

      <Section title="Dates">
        <InfoRow
          label="Arrival Date"
          value={formatDateLong(shipment.arrival_date)}
        />

        <InfoRow label="ETA" value={formatDateLong(shipment.eta)} />

        <InfoRow
          label="Delivery By Date"
          value={formatDateLong(shipment.delivery_by_date)}
        />
      </Section>

      <Section title="Assignment">
        <InfoRow label="Assignment ID" value={shipment.assignment_id || "—"} />
      </Section>

      <Section title="Location">
        <InfoRow label="Latitude" value={shipment.lat} />
        <InfoRow label="Longitude" value={shipment.lng} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>

      <dl className="rounded-lg border border-neutral-200 bg-white">
        {children}
      </dl>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <dt className="text-sm text-neutral-500">{label}</dt>

      <dd className="col-span-2 break-all text-sm font-medium text-neutral-900">
        {value}
      </dd>
    </div>
  );
}
