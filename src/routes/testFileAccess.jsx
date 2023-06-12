import React, { useState } from "react";
import { useTauriContext } from "../context/TauriProvider";
import { readDir } from "@tauri-apps/api/fs";

export default function TestFileAccess() {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();

  const [markdownFiles, setMarkdownFiles] = useState([]);

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
      setMarkdownFiles(entries);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-base-100 w-full h-full">
      <div>File Access</div>
      <button className="btn btn-success" onClick={getDir}>
        Click To Test
      </button>
      {markdownFiles && <div>{JSON.stringify(markdownFiles)}</div>}
    </div>
  );
}
