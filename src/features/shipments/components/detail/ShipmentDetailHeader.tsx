import { Pencil, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Shipment } from '../../types/shipment.types';
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from '../../lib/shipment.utils';


interface Props {
  shipment: Shipment;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ShipmentDetailHeader({ shipment, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-200 pb-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-neutral-900">
            {shipment.client_name}
          </h2>
          <Badge variant={STATUS_BADGE_VARIANT[shipment.status]}>
            {STATUS_LABEL[shipment.status]}
          </Badge>
        </div>
        {shipment.label && (
          <p className="mt-1 text-sm text-neutral-500">{shipment.label}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={onDelete}
            className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}