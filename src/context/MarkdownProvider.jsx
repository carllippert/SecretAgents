import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import { useTauriContext } from "./TauriProvider";

export const APP_NAME = tauriConfJson.package.productName;
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;

// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const MarkdownContext = React.createContext({
  filePath: undefined,
  fileContent: undefined,
  setFilePath: undefined,
  markdownPaths: [],
});

export const useMarkdownContext = () => useContext(MarkdownContext);
export function MarkdownProvider({ children }) {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();

  const [filePathString, setFilePathString] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [markdownPaths, setMarkdownPaths] = useState([]);

  const setFilePath = async (filePath) => {
    setFilePathString(filePath);
    let content = await readTextFile(filePath);
    console.log("content", content);
    setFileContent(content);
    // setFileContent(readTextFile(filePath));
  };

  const getDir = async () => {
    try {
      const entries = await readDir(appDocuments + "/markdown", {
        recursive: true,
      });

      for (const entry of entries) {
        console.log("Entry", entry);

        console.log(`Entry: ${entry.path}`);
        if (entry.children) {
          processEntries(entry.children);
        }
      }
      setMarkdownPaths(entries);
      setFilePath(entries[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDir();
  }, [appDocuments]);

  return (
    <MarkdownContext.Provider
      value={{
        filePath: filePathString,
        setFilePath,
        markdownPaths,
        fileContent,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
}
