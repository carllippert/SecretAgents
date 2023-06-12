import React, { useState } from "react";
import { Form } from "react-router-dom";
import { Command } from "@tauri-apps/api/shell";

export default function TestPythonSideCar() {
  const [greeting, setGreeting] = useState("");

  async function greet() {
    const command = Command.sidecar("bin/python/test");
    const output = await command.execute();
    const { stdout, stderr } = output;

    setGreeting(stdout);
  }
  return (
    <div className="bg-base-100 w-full h-full">
      <div>Python Sidecar</div>
      <button className="btn btn-success" onClick={greet}>
        Click To Test
      </button>
      {greeting && <div>{greeting}</div>}
    </div>
  );
}
