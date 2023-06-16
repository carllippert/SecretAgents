import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import Messages from "../components/messages";
import {
  AGENT_AVATAR,
  useMessagingContext,
} from "../context/MessagingProvider";
import clsx from "clsx";

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
                  <h3 className="text-lg font-semibold">Secret Agent</h3>
                  <p className="text-gray-500">Hey whats up?</p>
                </div>
              </li>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => {
                    setCurrentChat(chat.id);
                  }}
                  className={clsx(
                    "flex items-center px-4 py-3 border-b border-gray-700",
                    {
                      "bg-gray-700": chat.id === currentChat,
                    }
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src={chat.avatar}
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  <div className="flex-grow ml-4">
                    <h3 className="text-lg font-semibold">{chat.title}</h3>
                    <p className="text-gray-500">{chat.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LeftPanel>
      <div className="flex flex-col w-full h-full bg-pink-100">
        {/* <div className="w-full h-full bg-pink-100">
          w-full h-full bg-pink-100
        </div> */}
        {/* <Outlet /> */}
        <Messages />
      </div>
    </div>
  );
}
