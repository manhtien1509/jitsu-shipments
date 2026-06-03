import type { ShipmentStatus } from "@/features/shipments/types/shipment.types";
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
} from "@/features/shipments/lib/shipment.utils";
import { Badge } from "@/shared/components/ui";

interface Props {
  status: ShipmentStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <Badge
      variant={STATUS_BADGE_VARIANT[status]}
      dot
      size="sm"
      className="shrink-0"
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
