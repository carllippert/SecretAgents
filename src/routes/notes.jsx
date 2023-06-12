import React, { useState, useEffect } from "react";
import LeftPanel from "../components/leftPanel";
import FileExplorer from "../components/fileExplorer";

import Editor from "@monaco-editor/react";
import { useMarkdownContext } from "../context/MarkdownProvider";

export default function Notes() {
  const { filePath, fileContent } = useMarkdownContext();

  const [markdown, setMarkdown] = useState("**Hello world!!!**");

  const handleEditorChange = (ev, value) => {
    setMarkdown(value);
    console.log("value", value); // eslint-disable-line no-console
  };

  useEffect(() => {
    console.log("filePath", filePath);
    console.log("fileContent", fileContent);
    setMarkdown(fileContent);
  }, [filePath, fileContent]);

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
          value={markdown}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
