import type { Shipment } from "@/features/shipments/types/shipment.types";
import { useState } from "react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { SplitLayout } from "@/shared/components/layout/SplitLayout";
import { ShipmentListPanel } from "../components/list/ShipmentListPanel";
import { ShipmentDetailPanel } from "../components/detail/ShipmentDetailPanel";
import { ShipmentsPageDialogs } from "./ShipmentsPageDialogs";
import { useDeleteShipmentHandler } from "./hooks/useDeleteShipmentHandler";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function ShipmentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [mobileView, setMobileView] = useState<"left" | "right">("left");

  const {
    deletingShipment,
    setDeletingShipment,
    isDeleting,
    handleDeleteConfirm,
    handleDeleteClose,
  } = useDeleteShipmentHandler();

  useDocumentTitle("Shipments");

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Shipments"
        showBack={mobileView === "right"}
        onBack={() => setMobileView("left")}
      />

      <div className="flex-1 min-h-0">
        <SplitLayout
          mobileView={mobileView}
          left={
            <ShipmentListPanel
              onCreateClick={() => setCreateOpen(true)}
              onSelect={() => setMobileView("right")}
            />
          }
          right={
            <ShipmentDetailPanel
              onEdit={setEditingShipment}
              onDelete={setDeletingShipment}
            />
          }
        />
      </div>

      <ShipmentsPageDialogs
        createOpen={createOpen}
        onCreateClose={() => setCreateOpen(false)}
        editingShipment={editingShipment}
        onEditClose={() => setEditingShipment(null)}
        deletingShipment={deletingShipment}
        isDeleting={isDeleting}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={handleDeleteClose}
      />
    </div>
  );
}
