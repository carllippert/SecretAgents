import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import Messages from "../components/messages";
import {
  AGENT_AVATAR,
  useMessagingContext,
} from "../context/MessagingProvider";
import clsx from "clsx";
import { formatPushDIDForFrontEnd } from "../utils";

export default function Messaging() {
  const { chats, currentChat, setCurrentChat } = useMessagingContext();

  return (
    <div className="flex flex-row h-full w-full">
      <LeftPanel>
        <div className="flex flex-col w-64 ">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white text-2xl font-bold">Chats</h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            <ul className="py-2">
              <li
                key={0}
                onClick={() => {
                  setCurrentChat(0);
                }}
                className={clsx(
                  "flex items-center px-4 py-3 border-b border-gray-700",
                  {
                    "bg-gray-700": 0 === currentChat,
                  }
                )}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12">
                    <img
                      className="object-cover w-full h-full rounded-full"
                      src={AGENT_AVATAR}
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">Secret Agent 🤖</h3>
                  <p className="text-gray-500">How can I help?</p>
                </div>
              </li>
              {chats.map((chat) => {
                // console.log("Chat In Drawer", chat);
                return (
                  <li
                    key={chat.chatId}
                    onClick={() => {
                      setCurrentChat(chat.chatId);
                    }}
                    className={clsx(
                      "flex items-center px-4 py-3 border-b border-gray-700",
                      {
                        "bg-gray-700": chat.chatId === currentChat,
                      }
                    )}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={chat.profilePicture}
                          alt="User Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow ml-4">
                      <h3 className="text-lg font-semibold">
                        {formatPushDIDForFrontEnd(chat.did)}
                      </h3>
                      <p className="text-gray-500">{chat.message}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </LeftPanel>
      <div className="flex flex-col w-full h-full bg-primary-100">
        <Messages />
      </div>
    </div>
  );
}
