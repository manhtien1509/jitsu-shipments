import { Trash2 } from "lucide-react";
import { Badge, Button } from "@/shared/components/ui";
import type { Assignment } from "@/features/assignments/types/assignment.types";
import {
  ASSIGNMENT_STATUS_BADGE_VARIANT,
  ASSIGNMENT_STATUS_LABEL,
  canDeleteAssignment,
} from "@/features/assignments/lib/assignment-utils";

interface Props {
  assignment: Assignment;
  onDelete?: () => void;
}

export function AssignmentDetailHeader({ assignment, onDelete }: Props) {
  const deletable = canDeleteAssignment(assignment);

  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-base font-semibold text-neutral-900">
            {assignment.label}
          </h2>
          <Badge variant={ASSIGNMENT_STATUS_BADGE_VARIANT[assignment.status]}>
            {ASSIGNMENT_STATUS_LABEL[assignment.status]}
          </Badge>
        </div>
        <div className="mt-0.5 text-xs text-neutral-500">{assignment.id}</div>
      </div>

      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!deletable}
          leftIcon={<Trash2 className="h-4 w-4" />}
          title={
            deletable
              ? "Delete assignment?"
              : "Only empty assignments can be deleted"
          }
        >
          Delete
        </Button>
      )}
    </div>
  );
}
