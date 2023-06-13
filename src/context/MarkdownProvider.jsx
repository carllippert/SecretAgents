import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";
import { useTauriContext } from "./TauriProvider";
import { usePolybase, useDocument } from "@polybase/react";

// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const MarkdownContext = React.createContext({
  filePath: undefined,
  fileContent: undefined,
  setFilePath: undefined,
  updateFile: undefined,
  createFile: undefined,
  markdownPaths: [],
});

export const useMarkdownContext = () => useContext(MarkdownContext);
export function MarkdownProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();

  const polybase = usePolybase();
  const { data, error, loading } = useDocument(
    polybase.collection("users").record("id")
  );

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

  const getDirectories = async () => {
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

  const updateFile = async (filePath, content) => {
    try {
      await fs.writeFile(filePath, content);
    } catch (error) {
      console.error(error);
    }
  };

  const createFile = async () => {
    try {
      // create new file called "newFile.md"
      const filePath = appDocuments + "/markdown/newFile.md";
      const content = "# New File";
      await fs.writeFile(filePath, content);
      //select as path
      setFilePath(filePath);
      getDirectories();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDirectories();
  }, [appDocuments]);

  return (
    <MarkdownContext.Provider
      value={{
        filePath: filePathString,
        setFilePath,
        markdownPaths,
        fileContent,
        updateFile,
        createFile,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
}
