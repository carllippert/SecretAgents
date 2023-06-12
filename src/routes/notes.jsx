import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import FileExplorer from "../components/fileExplorer";

import Editor from "@monaco-editor/react";

export default function Notes() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="flex flex-row h-full w-full ">
      <LeftPanel>
        <FileExplorer />
      </LeftPanel>
      <div className="flex flex-col w-full h-full bg-pink-100">
        {/* <Outlet /> */}
        {/* <MDEditor value={value} onChange={setValue} /> */}
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="markdown"
          defaultValue="// some comment from carl"
        />
      </div>
    </div>
  );
}
