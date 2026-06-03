import type { Assignment } from "@/features/assignments/types/assignment.types";

interface Props {
  assignment: Assignment;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <dt className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="text-right text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export function AssignmentInfoSection({ assignment }: Props) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold text-neutral-900">
        Assignment Info
      </h3>
      <dl className="divide-y divide-neutral-100">
        <Row label="ID" value={assignment.id} />
        <Row label="Label" value={assignment.label} />
        <Row label="Status" value={assignment.status} />
        <Row label="Shipments" value={assignment.shipment_count} />
        <Row
          label="Clients"
          value={
            assignment.clients.length === 0
              ? "—"
              : assignment.clients.join(", ")
          }
        />
      </dl>
    </div>
  );
}
