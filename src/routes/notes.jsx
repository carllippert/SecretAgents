import React, { useState, useEffect } from "react";
import LeftPanel from "../components/leftPanel";
import FileExplorer from "../components/fileExplorer";
import Editor from "@monaco-editor/react";
import { useFileContext } from "../context/FileProvider";

export default function Notes() {
  const { filePath, fileContent, updateFile } = useFileContext();

  const [markdown, setMarkdown] = useState("");

  const updateContext = () => {
    console.log("updateContext");
    updateFile(filePath, markdown);
  };

  //from GPT
  useEffect(() => {
    const delay = 2000; // Delay in milliseconds
    let timeoutId;

    const debounceInput = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateContext();
      }, delay);
    };

    debounceInput();

    return () => {
      clearTimeout(timeoutId); // Cleanup timeout on component unmount
    };
  }, [markdown]);

  const handleEditorChange = (value, event) => {
    console.log("EditorChanged", value);
    setMarkdown(value);
  };

  //end GPT

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
