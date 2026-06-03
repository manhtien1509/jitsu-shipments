import { useMemo } from "react";
import { Inbox, Plus } from "lucide-react";
import { Button, EmptyState, SkeletonRow } from "@/shared/components/ui";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useAssignments } from "@/features/assignments/api/useAssignments";
import { useAssignmentsStore } from "@/features/assignments/store/assignments.store";
import { ASSIGNMENT_STATUS_ORDER } from "@/features/assignments/lib/assignment-utils";
import type {
  Assignment,
  AssignmentStatus,
} from "@/features/assignments/types/assignment.types";
import { AssignmentSearchBar } from "./AssignmentSearchBar";
import { AssignmentListGroup } from "./AssignmentListGroup";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateClick?: () => void;
}

export function AssignmentListPanel({
  selectedId,
  onSelect,
  onCreateClick,
}: Props) {
  const search = useAssignmentsStore((s) => s.searchQuery);
  const setSearch = useAssignmentsStore((s) => s.setSearchQuery);
  const debouncedSearch = useDebouncedValue(search, 250);

  const { data, isLoading, isError, refetch } = useAssignments();

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((a) => a.label.toLowerCase().includes(q));
  }, [data, debouncedSearch]);

  const grouped = useMemo(() => {
    const map: Record<AssignmentStatus, Assignment[]> = {
      OPEN: [],
      COMPLETED: [],
    };
    for (const a of filtered) map[a.status].push(a);
    return map;
  }, [filtered]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2">
        <div className="flex-1">
          <AssignmentSearchBar value={search} onChange={setSearch} />
        </div>
        {onCreateClick && (
          <Button
            size="sm"
            onClick={onCreateClick}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && (
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {isError && !isLoading && (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Failed to load assignments"
            description="Something went wrong. Please try again."
            action={
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={debouncedSearch ? "No results" : "No assignments yet"}
            description={
              debouncedSearch
                ? `No assignment matches "${debouncedSearch}".`
                : "Create your first assignment."
            }
            action={
              !debouncedSearch && onCreateClick ? (
                <Button
                  size="sm"
                  onClick={onCreateClick}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  New assignment
                </Button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div>
            {ASSIGNMENT_STATUS_ORDER.map((status) => (
              <AssignmentListGroup
                key={status}
                status={status}
                assignments={grouped[status]}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
