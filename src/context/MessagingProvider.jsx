import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";

import { useTauriContext } from "./TauriProvider";
// import { main } from "../protocols/libp2p/libp2pchat";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";
import { useLangchainContext } from "./LangchainProvider";

// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const MessagingContext = React.createContext({
  chats: [],
  currentChat: undefined,
  setCurrentChat: undefined,
  sendMessage: undefined,
  messages: [],
});

export const useMessagingContext = () => useContext(MessagingContext);
export function MessagingProvider({ children }) {
  const { fileSep, loading, documents, downloads, appDocuments } =
    useTauriContext();

  const { callModel } = useLangchainContext();

  const [currentChat, setCurrentChat] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      avatar:
        "https://pbs.twimg.com/profile_images/1650519711593947137/0qNyuwSX_400x400.jpg",
      start: "John Doe",
      name: "John Doe",
      time: "9:00 AM",
      message: "Hello, how are you?",
      status: "sent",
      show_status: true,
      receipt: true,
    },
    {
      id: 2,
      avatar:
        "https://pbs.twimg.com/profile_images/1650519711593947137/0qNyuwSX_400x400.jpg",
      start: "Jane Smith",
      name: "Jane Smith",
      time: "10:30 AM",
      message: "I am doing great!",
      status: "received",
      show_status: true,
      receipt: false,
    },
    // Add more message objects here...
    {
      id: 5,
      avatar:
        "https://pbs.twimg.com/profile_images/1650519711593947137/0qNyuwSX_400x400.jpg",
      start: "David Johnson",
      name: "David Johnson",
      time: "3:45 PM",
      message: "See you tomorrow!",
      status: "sent",
      show_status: true,
      receipt: true,
    },
  ]);

  // Zero will be special. will use for agent.
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Chat 1",
      message: "Last message in Chat 1...",
    },
    {
      id: 2,
      title: "Chat 2",
      message: "Last message in Chat 2...",
    },
    {
      id: 3,
      title: "Chat 3",
      message: "Last message in Chat 3...",
    },
    {
      id: 4,
      title: "Chat 4",
      message: "Last message in Chat 4...",
    },
  ]);

  // const startChat = async () => {
  //   const chat = await main();
  //   console.log(chat);
  // };

  // useEffect(() => {
  //   startChat();
  // }, []);

  const sendAgentMessage = async (message) => {
    console.log("sendAgentMessage => ", message);
    // const response = await chatChain.call({ message });
    const response = await callModel(message);
    console.log("response form chatchain in messageProvider => ", response);
    return response;
  };

  const sendChatMessage = async (message) => {
    console.log("sendChatMessage => ", message);
    return true;
  };

  const sendMessage = async (message) => {
    if (currentChat === 0) {
      console.log("sendAgentMessage in SendMessage Router => ", message);
      return await sendAgentMessage(message);
    } else {
      return await sendChatMessage(message);
    }
  };

  return (
    <MessagingContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        sendMessage,
        messages,
        // filePath: filePathString,
        // setFilePath,
        // markdownPaths,
        // fileContent,
        // updateFile,
        // createFile,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}
