import { lazy } from "react";

export const ShipmentsPage = lazy(() =>
  import("@/features/shipments/pages/ShipmentsPage").then((m) => ({
    default: m.ShipmentsPage,
  })),
);

export const AssignmentsPage = lazy(() =>
  import("@/features/assignments/pages/AssignmentsPage").then((m) => ({
    default: m.AssignmentsPage,
  })),
);
