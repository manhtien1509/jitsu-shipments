import { Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/shared/components/layout/AppShell';
import { ShipmentsPage } from '@/pages/ShipmentsPage';
import { AssignmentsPage } from '@/pages/AssignmentsPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/shipments" replace /> },
      { path: 'shipments', element: <ShipmentsPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'assignments/:assignmentId', element: <AssignmentsPage /> },
      { path: '*', element: <Navigate to="/shipments" replace /> },
    ],
  },
];