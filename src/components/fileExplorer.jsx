import React, { useState, useEffect } from "react";
// import { readDir } from "@tauri-apps/api/fs";
import { FaFolder, FaFile } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { useMarkdownContext } from "../context/MarkdownProvider";
import clsx from "clsx";

const FileExplorer = () => {
  // const { fileSep, loading, documents, downloads, appDocuments } =
  //   useTauriContext();

  // const [markdownFiles, setMarkdownFiles] = useState([]);

  const { markdownPaths, setFilePath, filePath, createFile } =
    useMarkdownContext();

  return (
    <div className="flex flex-col text-gray-300 w-64 h-screen">
      <div className="flex flex-row p-4 border-b border-gray-700">
        <div className="flex-1 w-full ">
          <h2 className=" text-white text-2xl font-bold">Notes</h2>
        </div>
        {/* <h2 className=" text-white text-2xl font-bold">Notes</h2> */}
        <div className="min-w-10 h-10" onClick={createFile}>
          <AiFillFileAdd className="h-6 w-6 mt-2" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="py-2">
          {markdownPaths.map((file) => {
            console.log("File", file);
            return (
              <li
                className={clsx("px - 4 py-2 flex items-center", {
                  "bg-gray-700": filePath === file.path,
                })}
                onClick={() => {
                  setFilePath(file.path);
                }}
              >
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
