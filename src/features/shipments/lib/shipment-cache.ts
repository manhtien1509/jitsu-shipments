import type { QueryClient } from "@tanstack/react-query";
import { shipmentsApi } from "../api/shipments.api";
import { shipmentKeys } from "../api/shipments.keys";
import type { Shipment } from "../types/shipment.types";

/**
 * Fetch shipment via React Query (cache-first, network fallback).
 *
 * Use this only when the caller has just an `id` (e.g. from URL params)
 * and not the full Shipment object. Prefer passing the object directly.
 */
export async function ensureShipment(
  queryClient: QueryClient,
  id: string,
): Promise<Shipment> {
  return queryClient.fetchQuery({
    queryKey: shipmentKeys.detail(id),
    queryFn: () => shipmentsApi.getById(id),
  });
}

/**
 * Compute which assignments are impacted when a shipment's
 * assignment_id changes (for stats recompute & cache invalidation).
 */
export function diffAssignmentImpact(
  prevAssignmentId: string | null | undefined,
  nextAssignmentId: string | null | undefined,
): {
  changed: boolean;
  toRecompute: string[];
  toInvalidate: string[];
} {
  const prev = prevAssignmentId ?? null;
  const next = nextAssignmentId ?? null;
  const changed = prev !== next;

  const affected = new Set<string>();
  if (changed) {
    if (prev) affected.add(prev);
    if (next) affected.add(next);
  }

  const toInvalidate = new Set<string>();
  if (prev) toInvalidate.add(prev);
  if (next) toInvalidate.add(next);

  return {
    changed,
    toRecompute: Array.from(affected),
    toInvalidate: Array.from(toInvalidate),
  };
}
