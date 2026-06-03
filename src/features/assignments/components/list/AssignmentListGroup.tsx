import type {
  Assignment,
  AssignmentStatus,
} from "@/features/assignments/types/assignment.types";
import { ASSIGNMENT_STATUS_LABEL } from "@/features/assignments/lib/assignment-utils";
import { AssignmentListItem } from "./AssignmentListItem";

interface Props {
  status: AssignmentStatus;
  assignments: Assignment[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export function AssignmentListGroup({
  status,
  assignments,
  selectedId,
  onSelect,
}: Props) {
  if (assignments.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {ASSIGNMENT_STATUS_LABEL[status]}
        </h3>
        <span className="text-xs text-neutral-400">{assignments.length}</span>
      </div>

      <div className="space-y-1.5">
        {assignments.map((a) => (
          <AssignmentListItem
            key={a.id}
            assignment={a}
            selected={selectedId === a.id}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
