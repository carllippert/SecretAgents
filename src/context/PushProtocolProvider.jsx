import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import {
  APP_NAME,
  RUNNING_IN_TAURI,
  USERNAME,
  formatEtherAddressFromPushDID,
  formatPushDIDForFrontEnd,
} from "../utils";
import { useTauriContext } from "./TauriProvider";
// import { usePolybase, useDocument, useCollection } from "@polybase/react";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import { useLangchainContext } from "./LangchainProvider";

const PK = import.meta.env.VITE_ETHEREUM_PRIVATE_KEY;
const PUBKEY = import.meta.env.VITE_ETHEREUM_PUBLIC_KEY;
const Pkey = "0x" + PK;
const signer = new ethers.Wallet(Pkey);
const ACCOUNT = `eip155:${PUBKEY}`;

// defaults are only for auto-complete
const PushProtocolContext = React.createContext({
  chats: [],
  messages: {}, // { chatId: [messages] }
  addMessageToCurrentMessagesForChat: undefined,
  sendPushChat: undefined,
});

export const usePushProtocolContext = () => useContext(PushProtocolContext);
export function PushProtocolProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();
  const { addDocuments } = useLangchainContext();
  const [pushProtocolUser, setPushProtocolUser] = useState(null);
  const [decryptedPGPKey, setDecryptedPGPKey] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});

  // { chatId: [messages] }

  const sendPushChat = async (messageText, toAddressDID) => {
    try {
      const response = await PushAPI.chat.send({
        messageContent: messageText,
        messageType: "Text", // can be "Text" | "Image" | "File" | "GIF"
        receiverAddress: toAddressDID,
        signer: signer,
        env: "staging",
        pgpPrivateKey: decryptedPGPKey,
      });

      console.log("Push Chat Response?", response);
      //setOnMessages or Replace?
    } catch (e) {
      console.log(e);
    }
  };
  const getUser = async () => {
    try {
      const user = await PushAPI.user.get({
        env: "staging",
        account: ACCOUNT,
      });
      console.log("Got Push User", user);
      setPushProtocolUser(user);
      return user;
    } catch (e) {
      setPushProtocolUser(null);
      console.log(e);
    }
  };

  const decryptUserPGP = async () => {
    try {
      console.log("Hit Decrypt");
      console.log(
        "Push User in Decrypt",
        JSON.stringify(pushProtocolUser, null, 3)
      );
      //response type
      //https://docs.push.org/developers/developer-tooling/push-sdk/sdk-packages-details/epnsproject-sdk-restapi/for-chat/initializing-user#response
      const response = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: pushProtocolUser?.encryptedPrivateKey,
        account: ACCOUNT,
        signer: signer,
        env: "staging",
      });

      console.log("Decrypted PGP Key", response);
      setDecryptedPGPKey(response);
      await fetchChats(response);
      return;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchChats = async (decryptedKey) => {
    console.log("Hit Fetch Chats");
    try {
      const response = await PushAPI.chat.chats({
        env: "staging",
        account: ACCOUNT,
        toDecrypt: true,
        pgpPrivateKey: decryptedKey || decryptedPGPKey,
      });

      console.log("Fetched Chats", response);
      setChats(response);

      //TODO: fetch messages for each chat
      await fetchMessages(decryptedKey, response);

      return;
    } catch (e) {
      console.log(e);
    }
  };

  const replaceCurrentMessagesForChat = (chatId, newMessagesArray) => {
    console.log("Saving Chat History for ID: ", chatId, newMessagesArray);
    setMessages((prevData) => ({
      ...prevData,
      [chatId]: newMessagesArray,
    }));
    //TODO: save to local storage
    //TODO: "addDocuments"
    let textArray = [];
    let metadataArray = [];

    newMessagesArray.forEach((message) => {
      console.log("Adding Message Text", message.messageContent);
      textArray.push(message.messageContent);
      metadataArray.push({ ...message, type: "message" });
    });

    addDocuments(textArray, metadataArray);
  };

  const addMessageToCurrentMessagesForChat = (chatId, newMessage) => {
    setMessages((prevData) => ({
      ...prevData,
      [chatId]:
        prevData && prevData[chatId]
          ? [...prevData[chatId], newMessage]
          : [newMessage],
    }));
    //TODO: save to local storage
    //TODO: "addDocuments"
    // let textArray = [];
    // let metadataArray = [];

    // newMessagesArray.forEach((message) => {
    //   console.log("Adding Message Text", message.messageContent);
    //   textArray.push(message.messageContent);
    //   metadataArray.push({ ...message, type: "message" });
    // });

    addDocuments([newMessage.message], [{ ...newMessage, type: "message" }]);
  };

  const totalFetch = async (chat, decryptedKey) => {
    try {
      let args = {
        account: ACCOUNT,
        env: "staging",
        conversationId: chat.chatId, // receiver's address or chatId of a group
      };

      console.log("Args", args);

      const conversationHash = await PushAPI.chat.conversationHash(args);

      let nextArgs = {
        env: "staging",
        threadhash: conversationHash.threadHash,
        account: ACCOUNT,
        limit: 10,
        toDecrypt: true,
        pgpPrivateKey: decryptedKey,
      };

      console.log("Next Args", nextArgs);

      const chatHistory = await PushAPI.chat.history(nextArgs);

      console.log("Chat History", chatHistory);

      let formattedChatHistory = chatHistory.map((message) => {
        const fromMessagePubKey = formatEtherAddressFromPushDID(
          message.fromDID
        );
        const toMessagePubKey = formatEtherAddressFromPushDID(message.toDID);
        return {
          ...message,
          id: message.timestamp,
          avatar: chat.profilePicture,
          start: fromMessagePubKey === PUBKEY ? true : false,
          name:
            toMessagePubKey === PUBKEY
              ? USERNAME
              : formatPushDIDForFrontEnd(message.toDID),
          time: new Date(message.timestamp).toISOString(),
          message: message.messageContent,
          status: "sent",
          show_status: true,
        };
      });

      replaceCurrentMessagesForChat(
        chat.chatId,
        formattedChatHistory.reverse()
      );

      return chatHistory;
    } catch (e) {
      console.log("error fetching all chats", e);
    }
  };

  const fetchMessages = async (decryptedKey, passedChats) => {
    //Loop through hashes and fech messages for each
    try {
      let channelFetches = [];

      let localChats = passedChats || chats;
      let decryptKey = decryptedKey || decryptedPGPKey;

      for (let i = 0; i < localChats.length; i++) {
        channelFetches.push(totalFetch(localChats[i], decryptKey));
      }

      const allChats = await Promise.all(channelFetches);
    } catch (e) {
      console.log("error fetching all chats", e);
    }
  };

  const createUser = async () => {
    try {
      if (!pushProtocolUser) {
        const user = await PushAPI.user.create({
          env: "staging",
          account: ACCOUNT,
          signer: signer,
        });
        console.log("Created New Push User", user);
        setPushProtocolUser(user);
        return;
      } else {
        throw new Error("User already exists, Don't create. ");
      }
    } catch (e) {
      setPushProtocolUser(null);
      console.log(e);
    }
  };

  const initialize = async () => {
    //GET USER
    let res = await getUser();
    if (!res) {
      //IF USER DOESNT EXIST CREATE
      let res = await createUser();
    }
  };

  useEffect(() => {
    if (pushProtocolUser) {
      console.log(pushProtocolUser);
      decryptUserPGP();
    }
  }, [pushProtocolUser]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <PushProtocolContext.Provider
      value={{
        chats,
        messages,
        addMessageToCurrentMessagesForChat,
        sendPushChat,
      }}
    >
      {children}
    </PushProtocolContext.Provider>
  );
}
