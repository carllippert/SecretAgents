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
import { LangchainProvider } from "./context/LangchainProvider";
import { PushProtocolProvider } from "./context/PushProtocolProvider";
import { PolybaseProvider } from "@polybase/react";
import { LocalPolybaseProvider } from "./context/LocalPolybaseProvider";
import { ethPersonalSign } from "@polybase/eth";
import "./styles.css";

import { Polybase } from "@polybase/client";
import Settings from "./routes/settings";

const defaultNamespace = import.meta.env.VITE_POLYBASE_NAMESPACE;
const privateKey = import.meta.env.VITE_ETHEREUM_PRIVATE_KEY;

//confirmed no env problems
// console.log("defaultNamespace", defaultNamespace);
// console.log("privateKey", privateKey);

const polybase = new Polybase({
  defaultNamespace,
});

polybase.signer(async (data) => {
  return {
    h: "eth-personal-sign",
    sig: ethPersonalSign("0x" + privateKey, data),
  };
});

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
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TauriProvider>
      <PolybaseProvider polybase={polybase}>
        <LocalPolybaseProvider>
          <LangchainProvider>
            <PushProtocolProvider>
              <FileProvider>
                <MessagingProvider>
                  <RouterProvider router={router} />
                </MessagingProvider>
              </FileProvider>
            </PushProtocolProvider>
          </LangchainProvider>
        </LocalPolybaseProvider>
      </PolybaseProvider>
    </TauriProvider>
  </React.StrictMode>
);
