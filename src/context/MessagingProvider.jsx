import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";

import { useTauriContext } from "./TauriProvider";
// import { main } from "../protocols/libp2p/libp2pchat";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";

// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const MessagingContext = React.createContext({
  filePath: undefined,
  fileContent: undefined,
  setFilePath: undefined,
  updateFile: undefined,
  createFile: undefined,
  markdownPaths: [],
});

export const useMessagingContext = () => useContext(MessagingContext);
export function MessagingProvider({ children }) {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();

  // const startChat = async () => {
  //   const chat = await main();
  //   console.log(chat);
  // };

  // useEffect(() => {
  //   startChat();
  // }, []);

  return (
    <MessagingContext.Provider
      value={
        {
          // filePath: filePathString,
          // setFilePath,
          // markdownPaths,
          // fileContent,
          // updateFile,
          // createFile,
        }
      }
    >
      {children}
    </MessagingContext.Provider>
  );
}
