import React, { useState, useEffect } from "react";
import LeftPanel from "../components/leftPanel";
import FileExplorer from "../components/fileExplorer";
import Editor from "@monaco-editor/react";
import { useFileContext } from "../context/FileProvider";

export default function Notes() {
  const { filePath, fileContent, updateFile } = useFileContext();

  const [markdown, setMarkdown] = useState("**Hello world!!!**");

  const handleEditorChange = (value, event) => {
    // conso;
    setMarkdown(value);
    //update file
    updateFile(filePath, value);
    console.log("value", value); // eslint-disable-line no-console
  };

  useEffect(() => {
    console.log("filePath", filePath);
    console.log("fileContent", fileContent);
    setMarkdown(fileContent);
  }, [filePath, fileContent]);

  return (
    <div className="flex flex-row h-full w-full">
      <LeftPanel>
        <FileExplorer />
      </LeftPanel>
      <div className="flex flex-col w-full h-full bg-pink-100">
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="markdown"
          value={markdown}
          onChange={handleEditorChange}
          options={{
            fontSize: 15,
          }}
        />
      </div>
    </div>
  );
}
