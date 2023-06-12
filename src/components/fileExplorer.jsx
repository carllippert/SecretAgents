import React from "react";
import { FaFolder, FaFile } from "react-icons/fa";

const FileExplorer = () => {
  return (
    <div className="flex flex-col text-gray-300 w-64 h-screen">
      {/* <div className="flex items-center justify-center h-16 px-4">
        <h2 className="text-xl font-bold">File Explorer</h2>
          </div> */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white text-2xl font-bold">Notes</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="py-2">
          <li className="px-4 py-2 flex items-center">
            <FaFolder className="mr-2" />
            <span>Folder 1</span>
          </li>
          <li className="px-4 py-2 flex items-center">
            <FaFolder className="mr-2" />
            <span>Folder 2</span>
          </li>
          <li className="px-4 py-2 flex items-center">
            <FaFile className="mr-2" />
            <span>File 1.txt</span>
          </li>
          <li className="px-4 py-2 flex items-center">
            <FaFile className="mr-2" />
            <span>File 2.js</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
