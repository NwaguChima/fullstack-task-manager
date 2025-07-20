import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./app.routes";
import "./index.css";
import { Toaster } from "sonner";
import { AppProviders } from "./app.provider";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster richColors />
    </AppProviders>
  </React.StrictMode>,
);
