import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./root";
import ErrorPage from "./error-page";
import TestPythonSideCar from "./routes/testPythonSidecar";
import TestFileAccess from "./routes/testFileAccess";
import Notes from "./routes/notes";
import Messaging from "./routes/messaging";
import { TauriProvider } from "./context/TauriProvider";
import { MarkdownProvider } from "./context/MarkdownProvider";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "python",
        element: <TestPythonSideCar />,
      },
      {
        path: "files",
        element: <TestFileAccess />,
      },
      {
        path: "messaging",
        element: <Messaging />,
      },
      {
        path: "notes",
        element: <Notes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TauriProvider>
      <MarkdownProvider>
        <RouterProvider router={router} />
      </MarkdownProvider>
    </TauriProvider>
  </React.StrictMode>
);
