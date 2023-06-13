import React, { useState, useEffect } from "react";
// import { readDir } from "@tauri-apps/api/fs";
import { FaFolder, FaFile } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { useMarkdownContext } from "../context/MarkdownProvider";
import clsx from "clsx";

const FileExplorer = () => {
  const [newFilePath, setNewFilePath] = useState(undefined);

  const { markdownPaths, setFilePath, filePath, createFile } =
    useMarkdownContext();

  return (
    <div className="flex flex-col text-gray-300 w-64 h-screen">
      <div className="flex flex-row p-4 border-b border-gray-700">
        <div className="flex-1 w-full ">
          <h2 className=" text-white text-2xl font-bold">Notes</h2>
        </div>
        {/* <h2 className=" text-white text-2xl font-bold">Notes</h2> */}
        {/* <div className="min-w-10 h-10" onClick={createFile}>
          <AiFillFileAdd className="h-6 w-6 mt-2" />
        </div> */}
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="py-2">
          {/* Add File */}
          <li className={clsx("px-4 py-2 flex items-center")}>
            {/* <FaFile className="mr-2" /> */}

            <input
              type="text"
              placeholder="newfile.md"
              value={newFilePath}
              onChange={(e) => {
                setNewFilePath(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs h-8"
            />
            <AiFillFileAdd
              className="h-8 w-8 ml-3"
              onClick={() => createFile(newFilePath)}
            />
          </li>
          {markdownPaths.map((file) => {
            // console.log("File", file);
            return (
              <li
                className={clsx("px-4 py-2 flex items-center", {
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
