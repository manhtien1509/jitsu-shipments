import { useMemo } from "react";
import { Inbox, Plus } from "lucide-react";
import { Button, EmptyState, SkeletonRow } from "@/shared/components/ui";
import { useShipments } from "../../hooks/useShipments";
import { useShipmentsStore } from "../../store/shipments.store";
import { ShipmentSearchBar } from "./ShipmentSearchBar";
import { STATUS_ORDER } from "../../lib/shipment.utils";
import type { Shipment, ShipmentStatus } from "../../types/shipment.types";
import { ShipmentListGroup } from "./ShipmentListGroup";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

interface Props {
  onCreateClick?: () => void;
}

export function ShipmentListPanel({ onCreateClick }: Props) {
  const search = useShipmentsStore((s) => s.searchQuery);
  const setSearch = useShipmentsStore((s) => s.setSearchQuery);
  const debouncedSearch = useDebouncedValue(search, 250);

  const { data, isLoading, isError, refetch } = useShipments();
  const selectedId = useShipmentsStore((s) => s.selectedId);
  const setSelectedId = useShipmentsStore((s) => s.setSelectedId);

  const filtered = useMemo<Shipment[]>(() => {
    if (!data) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;

    return data.filter((s) => {
      return (
        s.client_name.toLowerCase().includes(q) ||
        (s.label ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, debouncedSearch]);

  const grouped = useMemo(() => {
    const map: Record<ShipmentStatus, Shipment[]> = {
      OPEN: [],
      IN_TRANSIT: [],
      DELIVERED: [],
    };
    for (const s of filtered) map[s.status].push(s);
    return map;
  }, [filtered]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3">
        <div className="flex-1">
          <ShipmentSearchBar value={search} onChange={setSearch} />
        </div>
        {onCreateClick && (
          <Button
            size="md"
            onClick={onCreateClick}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {isError && !isLoading && (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Failed to load shipments"
            description="Something went wrong. Please try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={debouncedSearch ? "No results" : "No shipments yet"}
            description={
              debouncedSearch
                ? `No shipment matches "${debouncedSearch}".`
                : "Create your first shipment to get started."
            }
            action={
              !debouncedSearch && onCreateClick ? (
                <Button
                  onClick={onCreateClick}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  New shipment
                </Button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="flex flex-col gap-5">
            {STATUS_ORDER.map((status) => (
              <ShipmentListGroup
                key={status}
                status={status}
                shipments={grouped[status]}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
