import React, { useState } from "react";
import { useTauriContext } from "../context/TauriProvider";
import { useLangchainContext } from "../context/LangchainProvider";
import { readDir } from "@tauri-apps/api/fs";

// import { usePolybase, useDocument, useCollection } from "@polybase/react";
import { v4 as uuidv4 } from "uuid";
// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

export default function TestFileAccess() {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();
  // const polybase = usePolybase();
  const [markdownFiles, setMarkdownFiles] = useState([]);
  const { runChain } = useLangchainContext();

  const getDir = async () => {
    try {
      const entries = await readDir(appDocuments + "/markdown", {
        recursive: true,
      });

      for (const entry of entries) {
        console.log("Entry", entry);

        // console.log(`Entry: ${entry.path}`);
        // if (entry.children) {
        //   processEntries(entry.children);
        // }
      }
      setMarkdownFiles(entries);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFileToPolyBase = async () => {
    try {
      // const user = await polybase.collection("User").create(["42", "Carlos"]);
      console.log("saved", user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-base-100 w-full h-full">
      <div>File Access</div>
      <button className="btn btn-success" onClick={saveFileToPolyBase}>
        Click To Call Polybase
      </button>
      <br />
      <br />
      <button className="btn btn-success" onClick={runChain}>
        Click To CallChain
      </button>
      {markdownFiles && <div>{JSON.stringify(markdownFiles)}</div>}
    </div>
  );
}
