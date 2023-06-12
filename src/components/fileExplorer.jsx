import React, { useState } from "react";
import { readDir } from "@tauri-apps/api/fs";
import { FaFolder, FaFile } from "react-icons/fa";
import { useTauriContext } from "../context/TauriProvider";
import { useEffect } from "react";

const FileExplorer = () => {
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

  useEffect(() => {
    getDir();
  }, []);

  return (
    <div className="flex flex-col text-gray-300 w-64 h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white text-2xl font-bold">Notes</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="py-2">
          {markdownFiles.map((file) => {
            console.log("File", file);
            return (
              <li className="px-4 py-2 flex items-center">
                <FaFile className="mr-2" />
                <span>{file.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
