import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";
import { useTauriContext } from "./TauriProvider";
// import { usePolybase, useDocument, useCollection } from "@polybase/react";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

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
});

export const usePushProtocolContext = () => useContext(PushProtocolContext);
export function PushProtocolProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();
  const [pushProtocolUser, setPushProtocolUser] = useState(null);
  const [decryptedPGPKey, setDecryptedPGPKey] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({}); // { chatId: [messages] }

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
  };

  const addMessageToCurrentMessagesForChat = (chatId, newMessage) => {
    // setMessages((prevData) => ({
    //   ...prevData,
    //   [chatId]: [...prevData[chatId], newValue],
    // }));

    setMessages((prevData) => ({
      ...prevData,
      [chatId]:
        prevData && prevData[chatId]
          ? [...prevData[chatId], newMessage]
          : [newMessage],
    }));
  };

  const totalFetch = async (chatId, decryptedKey) => {
    try {
      let args = {
        account: ACCOUNT,
        env: "staging",
        conversationId: chatId, // receiver's address or chatId of a group
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

      replaceCurrentMessagesForChat(chatId, chatHistory);
      // setMessages((prevData) => ({
      //   ...prevData,
      //   [chatId]: chatHistory,
      // }));

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
        channelFetches.push(totalFetch(localChats[i].chatId, decryptKey));
      }

      const allChats = await Promise.all(channelFetches);

      console.log("ChatMap", messages);

      //TODO: set messages state

      console.log("All Chats", allChats);
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
      // await fetchChats();
    }
  }, [pushProtocolUser]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <PushProtocolContext.Provider
      value={{ chats, messages, addMessageToCurrentMessagesForChat }}
    >
      {children}
    </PushProtocolContext.Provider>
  );
}
