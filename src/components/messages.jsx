import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import Message from "./message";
import Container from "./container";
import { useLangchainContext } from "../context/LangchainProvider";
import { useMessagingContext } from "../context/MessagingProvider";

const Messages = () => {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  // const { chatChain  } = useLangchainContext();
  const { sendMessage, messages } = useMessagingContext();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    console.log("Sending message from input form", message);
    sendMessage(message);
  };

  return (
    <div className=" p-2 pt-8 bg-gray-900 overflow-y-auto scroll-container flex flex-col w-full h-full">
      {/* Chat */}
      {/* <Container> */}
      {/* <button onClick={callModel}>Start Chat</button> */}
      {messages.length > 0 ? (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              avatar={message.avatar}
              start={message.start}
              name={message.name}
              time={message.time}
              message={message.message}
              status={message.status}
              show_status={message.show_status}
              // receipt={message.receipt}
              // setMessages={setMessages}
            />
          ))}
          <div ref={messagesEndRef} />

          {/* Send Message Input */}
          <div className="flex-1 mt-1" />

          <div className="flex flex-row ml-1 mb-2">
            <input
              type="text"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
              placeholder="Type here"
              className="input input-bordered rounded-2xl h-10 w-full"
            />
            <button className=" ml-1" onClick={send}>
              <IoMdSend className="w-10 h-10 text-gray-500" />
            </button>
          </div>
        </>
      ) : (
        //  empty screen
        <div className="flex flex-col h-full">
          <div className="flex-1" />

          <div className="flex flex-row ml-1 mb-2">
            <input
              type="text"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
              placeholder="Type here"
              className="input input-bordered rounded-2xl h-10 w-full"
            />
            <button className=" ml-1" onClick={send}>
              <IoMdSend className="w-10 h-10 text-gray-500" />
            </button>
          </div>
        </div>
      )}
      {/* </Container> */}
    </div>
  );
};

export default Messages;
