import React from "react";
import { Command } from "@tauri-apps/api/shell";
import { useTauriContext } from "../context/TauriProvider";

export default function Settings() {
  const { polling, setPolling, liveVectorBuilding, setLiveVectorBuilding } =
    useTauriContext();

  async function greet() {
    console.log("testing python => ");
    const command = Command.sidecar("bin/python/test");
    const output = await command.execute();
    const { stdout, stderr } = output;

    if (stderr) {
      console.error("Python Error: ", stderr);
    }

    setGreeting(stdout);
  }
  return (
    <div className="bg-base-100 w-full h-full p-6">
      <div className="flex flex-row gap-3 pb-3">
        <span className="text-lg"> Live Vector Building</span>
        <input
          type="checkbox"
          className="toggle toggle-success"
          checked={liveVectorBuilding}
          onChange={() => setLiveVectorBuilding(!liveVectorBuilding)}
        />
      </div>
      <div className="flex flex-row gap-3 pb-3">
        <span className="text-lg">Message Polling</span>
        <input
          type="checkbox"
          className="toggle toggle-success"
          checked={polling}
          onChange={() => setPolling(!polling)}
        />
      </div>
    </div>
  );
}
