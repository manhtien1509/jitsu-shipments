import { Navigate, type RouteObject } from "react-router-dom";
import { Suspense } from "react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { LoadingFallback } from "@/shared/components/feedback/LoadingFallback";
import { ShipmentsPage, AssignmentsPage } from "./lazyPages";

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/shipments" replace /> },
      { path: "shipments", element: withSuspense(<ShipmentsPage />) },
      { path: "assignments", element: withSuspense(<AssignmentsPage />) },
      {
        path: "assignments/:assignmentId",
        element: withSuspense(<AssignmentsPage />),
      },
      {
        path: "assignments/:assignmentId/shipments/:shipmentId",
        element: withSuspense(<AssignmentsPage />),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
