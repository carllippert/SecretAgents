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
import { MessagingProvider } from "./context/MessagingProvider";
import { PolybaseProvider, AuthProvider } from "@polybase/react";
import { ethPersonalSign } from "@polybase/eth";

import { Polybase } from "@polybase/client";
import { Auth } from "@polybase/auth";
import { APP_NAME } from "./utils";

const defaultNamespace = import.meta.env.REACT_APP_POLYBASE_NAMESPACE;
const privateKey = import.meta.env.REACT_APP_ETHEREUM_PRIVATE_KEY;

const polybase = new Polybase({
  defaultNamespace,
  signer: (data) => {
    return {
      h: "eth-personal-sign",
      sig: ethPersonalSign(privateKey, data),
    };
  },
});

const auth = new Auth();

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
      <PolybaseProvider polybase={polybase}>
        <AuthProvider auth={auth} polybase={polybase}>
          <MessagingProvider>
            <MarkdownProvider>
              <RouterProvider router={router} />
            </MarkdownProvider>
          </MessagingProvider>
        </AuthProvider>
      </PolybaseProvider>
    </TauriProvider>
  </React.StrictMode>
);
