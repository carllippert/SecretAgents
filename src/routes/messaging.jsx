import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import Messages from "../components/messages";

export default function Messaging() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <LeftPanel>
        <div className="">Messages Container</div>
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
