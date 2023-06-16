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
  runChain: undefined,
  addDocuments: undefined,
  modelState: undefined,
});

let vectorStore = null;
let chain = null;

const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 });

const initVectorStore = async (texts, metadatas) => {
  vectorStore = new MemoryVectorStore(
    new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY })
  );
};

const initChain = async () => {
  chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      memory: new BufferMemory({
        memoryKey: "chat_history", // Must be set to "chat_history"
      }),
    }
  );
};

export const useLangchainContext = () => useContext(LangchainContext);
export function LangchainProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();

  const [markdownPaths, setMarkdownPaths] = useState([]);
  const [messagePaths, setMessagePaths] = useState([]);
  const [documentsAdded, setDocumentsAdded] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [modelState, setModelState] = useState("");
  const [live, setLive] = useState(false);

  const getLocalMarkdownDirectories = async () => {
    try {
      if (appDocuments !== undefined) {
        const entries = await readDir(appDocuments + "/markdown", {
          recursive: true,
        });

        setMarkdownPaths(entries);
      } else {
        console.log("appDocuments is undefined still");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMessageDirectories = async () => {
    try {
      if (appDocuments !== undefined) {
        const entries = await readDir(appDocuments + "/messages", {
          recursive: true,
        });
        setMessagePaths(entries);
      } else {
        console.log("appDocuments is undefined still");
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const runChain = async (message) => {
    // const chain = ConversationalRetrievalQAChain.fromLLM(
    //   model,
    //   vectorStore.asRetriever(),
    //   {
    //     memory: new BufferMemory({
    //       memoryKey: "chat_history", // Must be set to "chat_history"
    //     }),
    //   }
    // );
    /* Ask it a question */
    // const question = "What did carl say about the bird?";
    const res = await chain.call({ question: message });
    console.log("question answer", res);
    return res.text;
  };
  const addDocuments = async (textsArray, metadataArray) => {
    try {
      setLoadingDocuments(true);
      setModelState("Updating Model ...");

      const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
        chunkSize: 32,
        chunkOverlap: 0,
      });

      const mdOutput = await splitter.createDocuments(
        textsArray,
        metadataArray
      );

      console.log("mdOutput", mdOutput);

      await vectorStore.addDocuments(mdOutput);

      console.log("documents added");
      setDocumentsAdded(true);

      return;
    } catch (e) {
      console.log(e);
    } finally {
      setModelState("");
      setLoadingDocuments(false);
    }
  };

  const init = async () => {
    if (!vectorStore) {
      console.log("initing vector store");
      await initVectorStore();
    }
    if (!documentsAdded && !loadingDocuments && markdownPaths.length > 0) {
      console.log("adding documents");

      const { textsArray, metadataArray } = await getMarkdownFileContent();

      await addDocuments(textsArray, metadataArray);
    }
    if (!chain) {
      console.log("initing chain");
      await initChain();
    }
  };

  useEffect(() => {
    // if (live) {
    init();
    // }
  }, [markdownPaths]);

  useEffect(() => {
    getLocalMarkdownDirectories();
    getMessageDirectories();
  }, [appDocuments]);

  return (
    <LangchainContext.Provider
      value={{
        callModel: runChain,
        runChain,
        addDocuments,
        modelState,
      }}
    >
      {children}
    </LangchainContext.Provider>
  );
}
