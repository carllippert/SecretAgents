import React, { useCallback, useMemo } from "react";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "inboxNode",
    position: { x: 100, y: 50 },
    data: { value: "@SecretAgent: Inbox" },
  },
  {
    id: "2",
    position: { x: 400, y: 400 },
    data: { label: "Memory VectorStore" },
  },
  {
    id: "3",
    position: { x: 800, y: 400 },
    data: { label: "PushProtocoL Messages" },
  },
  {
    id: "4",
    position: { x: 800, y: 600 },
    data: { label: "PolyBase Notes" },
  },
  { id: "5", position: { x: 400, y: 400 }, data: { label: "OpenAI LLM" } },
  { id: "10", position: { x: 400, y: 200 }, data: { label: "@secretagent" } },

  {
    id: "42",
    type: "outBoxNode",
    position: { x: 100, y: 600 },
    data: { value: "@SecretAgent: Send" },
  },
];

const initialEdges = [
  { id: "1", source: "1", target: "2", sourceHandle: "b", targetHandle: "a" },
  { id: "2", source: "4", target: "2", sourceHandle: "b", targetHandle: "a" },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(
    () => ({ inboxNode: InboxNode, outboxNode: OutBoxNode }),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "94vw", height: "100vh" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls style={{ backgroundColor: "darkgray" }} />
        <MiniMap style={{ backgroundColor: "darkgray" }} />
        <Background variant="dots" gap={30} size={1} color="gray" />
      </ReactFlow>
    </div>
  );
}

// const handleStyle = { left: 10 };

function InboxNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className={
        "bg-secondary w-64 h-12 border rounded-md text-white flex flex-col justify-center align-middle" +
        data.classNames
      }
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xl">{data.value}</div>
      {/* <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  );
}

function OutBoxNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className={
        "bg-pink-200 w-64 h-12 border rounded-md text-white flex flex-col justify-center align-middle" +
        data.classNames
      }
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xl">{data.value}</div>
      {/* <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  );
}

function VectorNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className={
        "bg-secondary w-64 h-12 border rounded-md text-white flex flex-col justify-center align-middle" +
        data.classNames
      }
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xl">{data.value}</div>
      {/* <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  );
}

function PushNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className={
        "bg-secondary w-64 h-12 border rounded-md text-white flex flex-col justify-center align-middle" +
        data.classNames
      }
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xl">{data.value}</div>
      {/* <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  );
}

function PolyNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className={
        "bg-secondary w-64 h-12 border rounded-md text-white flex flex-col justify-center align-middle" +
        data.classNames
      }
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-center text-xl">{data.value}</div>
      {/* <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        // style={handleStyle}
      />
    </div>
  );
}
