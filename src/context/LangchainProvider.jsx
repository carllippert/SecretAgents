import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { useTauriContext } from "./TauriProvider";
import { useMarkdownContext } from "./MarkdownProvider";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  SupportedTextSplitterLanguages,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";

// import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
// import * as fs from "fs";

const OPEN_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// defaults are only for auto-complete
const LangchainContext = React.createContext({
  callModel: undefined,
  // chatChain: undefined,
});

// const chat = new ChatOpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0 });
const model = new OpenAI({
  openAIApiKey: OPEN_AI_KEY,
  temperature: 0.9,
});

export const useLangchainContext = () => useContext(LangchainContext);
export function LangchainProvider({ children }) {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();

  const { markdownPaths } = useMarkdownContext();

  // const callModel = async () => {
  //   console.log("openaikey => ", import.meta.env.VITE_OPENAI_API_KEY);
  //   // console.log("private key", privateKey);
  //   // const model = new OpenAI({
  //   //   openAIApiKey: OPEN_AI_KEY,
  //   //   temperature: 0.9,
  //   // });

  //   // runChat();

  //   const res = await model.call(
  //     "What would be a good company name a company that makes colorful socks?"
  //   );
  //   console.log(res);
  // };

  // const sendAgentMessage = async (message) => {

  const runChat = async (message) => {
    /* Initialize the LLM to use to answer the question */
    // const model = new OpenAI({});
    /* Load in the file we want to do question answering over */
    // const text = fs.readFileSync("state_of_the_union.txt", "utf8");
    /* Split the text into chunks */

    const { textsArray, metadataArray } = await getFileContent();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
    });
    const docs = await textSplitter.createDocuments(textsArray, metadataArray);
    /* Create the vectorstore */
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY })
    );

    /* Create the chain */
    let chat = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        memory: new BufferMemory({
          memoryKey: "chat_history", // Must be set to "chat_history"
        }),
      }
    );

    console.log("Set up chatChain in langchain");
    /* Ask it a question */
    // const question = "What have i writen about in my notes that you have";
    const res = await chat.call({ question: message });
    return res;
    // console.log(res);
    /* Ask it a follow up question */
    // const followUpRes = await chain.call({
    //   question: "Was packages?",
    // });
    // console.log(followUpRes);
  };

  const getFileContent = async () => {
    let textsArray = [];
    let metadataArray = [];

    markdownPaths.forEach(async (path) => {
      console.log("path in Langchain", path);
      let content = await readTextFile(path.path);
      console.log("content", content);
      textsArray.push(content);
      metadataArray.push({ type: "note", ...path });
    });

    return { textsArray, metadataArray };
  };

  useEffect(() => {
    if (markdownPaths) {
      runChat();
    }
  }, [markdownPaths]);

  return (
    <LangchainContext.Provider
      value={{
        callModel: runChat,
        // chatChain,
        // filePath: filePathString,
        // setFilePath,
        // markdownPaths,
        // fileContent,
        // updateFile,
        // createFile,
      }}
    >
      {children}
    </LangchainContext.Provider>
  );
}
