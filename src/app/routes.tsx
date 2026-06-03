import { Navigate, type RouteObject } from "react-router-dom";
import { AppShell } from "@/shared/components/layout/AppShell";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { ShipmentsPage } from "@/features/shipments/pages/ShipmentsPage";
import { AssignmentsPage } from "@/features/assignments/pages/AssignmentsPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/shipments" replace /> },
      { path: "shipments", element: <ShipmentsPage /> },
      { path: "assignments", element: <AssignmentsPage /> },
      {
        path: "assignments/:assignmentId",
        element: <AssignmentsPage />,
      },
      {
        path: "assignments/:assignmentId/shipments/:shipmentId",
        element: <AssignmentsPage />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
