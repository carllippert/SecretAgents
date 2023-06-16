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
import { useFileContext } from "./FileProvider";
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

const OPEN_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// defaults are only for auto-complete
const LangchainContext = React.createContext({
  callModel: undefined,
  callVector: undefined,
  runChain: undefined,
});

let vectorStore = null;
const initVectorStore = async (texts, metadatas) => {
  vectorStore = new MemoryVectorStore();
  return;
};

export const useLangchainContext = () => useContext(LangchainContext);
export function LangchainProvider({ children }) {
  const { markdownPaths, messagePaths } = useFileContext();

  const getMarkdownFileContent = async () => {
    if (markdownPaths.length === 0) {
      console.log("no markdownPaths");
      return;
    }
    let textsArray = [];
    let metadataArray = [];

    for (let i = 0; i < markdownPaths.length; i++) {
      let path = markdownPaths[i];
      if (path.path.includes(".DS_Store")) {
        continue;
      }
      let content = await readTextFile(path.path);

      textsArray.push(content);
      metadataArray.push({ type: "note", ...path });
    }

    return { textsArray, metadataArray };
  };

  const getMessageFileContent = async () => {
    if (messagePaths.length === 0) {
      console.log("no messagePaths");
      return;
    }

    let textsArray = [];
    let metadataArray = [];

    for (let i = 0; i < messagePaths.length; i++) {
      let path = messagePaths[i];
      if (path.path.includes(".DS_Store")) {
        continue;
      }
      let content = await readTextFile(path.path);

      textsArray.push(content);
      metadataArray.push({ type: "message", ...path });
    }

    return { textsArray, metadataArray };
  };

  const callVector = async () => {
    const { textsArray, metadataArray } = await getMarkdownFileContent();

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 32,
      chunkOverlap: 0,
    });

    const mdOutput = await splitter.createDocuments(textsArray, metadataArray);

    console.log("mdOutput", mdOutput);

    const vectorStore = await MemoryVectorStore.fromTexts(
      ["Hello world", "Bye bye", "hello nice world"],
      [{ id: 2 }, { id: 1 }, { id: 3 }],
      new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY })
    );

    const resultOne = await vectorStore.similaritySearch("hello world", 1);
    console.log(resultOne);
  };

  const runChain = async (message) => {
    const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 });

    const { textsArray, metadataArray } = await getMarkdownFileContent();

    console.log("textsArray", textsArray);
    console.log("metadataArray", metadataArray);

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 32,
      chunkOverlap: 0,
    });

    const mdOutput = await splitter.createDocuments(textsArray, metadataArray);
    console.log("mdOutput", mdOutput);
    //TODO: how to persist vectors?
    /* Create the vectorstore */
    const vectorStore = await MemoryVectorStore.fromDocuments(
      mdOutput,
      new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY })
    );
    /* Create the chain */
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        memory: new BufferMemory({
          memoryKey: "chat_history", // Must be set to "chat_history"
        }),
      }
    );
    /* Ask it a question */
    // const question = "What did carl say about the bird?";
    const res = await chain.call({ question: message });
    console.log("question answer", res);
    return res.text;

    /* Ask it a follow up question */
    // const followUpRes = await chain.call({
    //   question: "Was that nice?",
    // });
    // console.log(followUpRes);
  };

  const init = async () => {
    if (!vectorStore) {
      // if(markdownPaths.length > 0){
      initVectorStore();
      // }
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <LangchainContext.Provider
      value={{
        callModel: runChain,
        callVector,
        runChain,
      }}
    >
      {children}
    </LangchainContext.Provider>
  );
}
