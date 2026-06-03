import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { routes } from "../router/routes";

const router = createBrowserRouter(routes);

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
