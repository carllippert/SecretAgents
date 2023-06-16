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
import { useLangchainContext } from "./LangchainProvider";
import { usePolybase, useDocument, useCollection } from "@polybase/react";
// import { v4 as uuidv4 } from "uuid";
// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const FileContext = React.createContext({
  filePath: undefined,
  fileContent: undefined,
  setFilePath: undefined,
  updateFile: undefined,
  createFile: undefined,
  markdownPaths: [],
  messagePaths: [],
});

export const useFileContext = () => useContext(FileContext);

export function FileProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();
  const { addDocuments } = useLangchainContext();
  const polybase = usePolybase();

  const [filePathString, setFilePathString] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [markdownPaths, setMarkdownPaths] = useState([]);
  const [messagePaths, setMessagePaths] = useState([]);

  const setFilePath = async (filePath) => {
    setFilePathString(filePath);
    let content = await readTextFile(filePath);
    console.log("content", content);
    setFileContent(content);
  };

  const getLocalMarkdownDirectories = async () => {
    try {
      if (appDocuments !== undefined) {
        const entries = await readDir(appDocuments + "/markdown", {
          recursive: true,
        });

        setMarkdownPaths(entries);
        setFilePath(entries[0].path);
      } else {
        console.log("appDocuments is undefined still");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMessageDirectories = async () => {
    try {
      if (appDocuments !== undefined) {
        const entries = await readDir(appDocuments + "/messages", {
          recursive: true,
        });
        setMessagePaths(entries);
      } else {
        console.log("appDocuments is undefined still");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateFile = async (filePath, content) => {
    try {
      let path = await fs.writeFile(filePath, content);
      console.log("file updated");
      await addDocuments([content], [{ type: "note", ...path }]);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFileToPolyBase = async (fileName, content) => {
    try {
      console.log("filename", fileName);
      console.log("content", content);
      console.log("trying to save file to polybase", fileName, content);
      const note = await polybase
        .collection("Note")
        .create([fileName, content]);

      console.log("Note Saved: ", note);
    } catch (error) {
      console.error(error);
    }
  };

  const createFile = async (fileName) => {
    try {
      console.log("attempting to make new file called => ", fileName);

      const filePath = appDocuments + "/markdown/" + fileName + ".md";
      const content = fileName;
      let path = await fs.writeFile(filePath, content);
      console.log("path", path);
      //select as path
      setFilePath(filePath);
      //update vector
      addDocuments([content], [{ type: "note", ...path }]);

      getLocalMarkdownDirectories();
      saveFileToPolyBase(fileName, content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLocalMarkdownDirectories();
    getMessageDirectories();
  }, [appDocuments]);

  return (
    <FileContext.Provider
      value={{
        filePath: filePathString,
        setFilePath,
        markdownPaths,
        messagePaths,
        fileContent,
        updateFile,
        createFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
