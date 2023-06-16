window.global ||= window; //vite workaround
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./root";
import ErrorPage from "./error-page";
import TestPythonSideCar from "./routes/testPythonSidecar";
import TestFileAccess from "./routes/testFileAccess";
import Notes from "./routes/notes";
import Messaging from "./routes/messaging";
import Agents from "./routes/agents";

import { TauriProvider } from "./context/TauriProvider";
import { FileProvider } from "./context/FileProvider";
import { MessagingProvider } from "./context/MessagingProvider";
import { PolybaseProvider, AuthProvider } from "@polybase/react";
import { ethPersonalSign } from "@polybase/eth";
import "./styles.css";

import { Polybase } from "@polybase/client";
import { secp256k1 } from "@polybase/util";
import { Auth } from "@polybase/auth";
import { APP_NAME } from "./utils";
import { LangchainProvider } from "./context/LangchainProvider";
import { PushProtocolProvider } from "./context/PushProtocolProvider";

// const auth = new Auth();

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
        path: "agents",
        element: <Agents />,
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
      {/* <PolybaseProvider polybase={polybase}>
        <AuthProvider auth={auth} polybase={polybase}> */}
      <PushProtocolProvider>
        <LangchainProvider>
          <FileProvider>
            <MessagingProvider>
              <RouterProvider router={router} />
            </MessagingProvider>
          </FileProvider>
        </LangchainProvider>
      </PushProtocolProvider>
      {/* </AuthProvider>
      </PolybaseProvider> */}
    </TauriProvider>
  </React.StrictMode>
);
