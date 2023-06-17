import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { v4 as uuidv4 } from "uuid";

import { useTauriContext } from "./TauriProvider";
import {
  APP_NAME,
  RUNNING_IN_TAURI,
  USERNAME,
  formatEtherAddressFromPushDID,
} from "../utils";
import { useLangchainContext } from "./LangchainProvider";
import { usePushProtocolContext } from "./PushProtocolProvider";

const PUBKEY = import.meta.env.VITE_ETHEREUM_PUBLIC_KEY;

const CURRENT_USERNAME = USERNAME || "Anonymous";
export const AGENT_AVATAR =
  "https://apilgriminnarnia.files.wordpress.com/2017/06/data-star-trek.jpg";

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
  const {
    chats,
    messages: pushMessages,
    addMessageToCurrentMessagesForChat,
    sendPushChat,
  } = usePushProtocolContext();

  const [currentChat, setCurrentChat] = useState(0);

  const addMessage = async (message) => {
    addMessageToCurrentMessagesForChat(currentChat, message);
  };

  const sendAgentMessage = async (messageText) => {
    console.log("sendAgentMessage => ", messageText);
    const response = await callModel(messageText);

    console.log("response form chatchain in messageProvider => ", response);
    //addToComponentState
    addMessage({
      id: uuidv4(),
      avatar: AGENT_AVATAR,
      start: true,
      name: "Secret Agent",
      time: new Date().toISOString(),
      message: response,
      status: "sent",
      show_status: true,
    });
    return response;
  };

  const sendChatMessage = async (messageText) => {
    //
    // let message = {
    //   id: uuidv4(),
    //   avatar:
    //     "https://pbs.twimg.com/profile_images/1650519711593947137/0qNyuwSX_400x400.jpg",
    //   start: false,
    //   name: USERNAME,
    //   time: new Date().toISOString(),
    //   message: messageText,
    //   status: "sent",
    //   show_status: true,
    // };
    console.log("sendChatMessage => ", messageText);
    //Need to know who we are sending it too?
    let thisChat = pushMessages[currentChat][0];

    const fromMessagePubKey = formatEtherAddressFromPushDID(thisChat.fromDID);
    // const toMessagePubKey = formatEtherAddressFromPush(thisChat.toDID);

    //get the key that is not pubkey
    const otherWalletAddressDID =
      fromMessagePubKey === PUBKEY ? thisChat.toDID : thisChat.fromDID;

    await sendPushChat(messageText, otherWalletAddressDID);

    //TODO: Send Chat Via PushProtocol

    //TODO: send message via pushProtocool
    // addMessage(message);
    return true;
  };

  const sendMessage = async (message) => {
    console.log("message in sendMessage => ", message);

    //add to component state
    addMessage({
      id: uuidv4(),
      avatar:
        "https://pbs.twimg.com/profile_images/1650519711593947137/0qNyuwSX_400x400.jpg",
      start: false,
      name: CURRENT_USERNAME,
      time: new Date().toISOString(),
      message: message,
      status: "sent",
      show_status: true,
    });

    if (currentChat === 0) {
      console.log("sendAgentMessage in MessageProvider => ", message);
      return await sendAgentMessage(message);
    } else {
      return await sendChatMessage(message);
    }
  };

  // const saveMessagesToFile = async (fileName, messages) => {
  //   try {
  //     const filePath = appDocuments + "/messages/" + fileName;
  //     await fs.writeFile(filePath, messages);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <MessagingContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        sendMessage,
        messages: pushMessages,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}
