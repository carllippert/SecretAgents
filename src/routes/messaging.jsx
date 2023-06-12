import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import Messages from "../components/messages";

export default function Messaging() {
  return (
    <div className="flex flex-row h-full w-full">
      <LeftPanel>
        <div className="flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white text-2xl font-bold">Chats</h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            <ul className="py-2">
              <li className="flex items-center px-4 py-3 border-b border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-500"></div>
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">Chat 1</h3>
                  <p className="text-gray-500">Last message...</p>
                </div>
              </li>
              <li className="flex items-center px-4 py-3 border-b border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-500"></div>
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">Chat 2</h3>
                  <p className="text-gray-500">Last message...</p>
                </div>
              </li>
              <li className="flex items-center px-4 py-3 border-b border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-500"></div>
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">Chat 3</h3>
                  <p className="text-gray-500">Last message...</p>
                </div>
              </li>
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
