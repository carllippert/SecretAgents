import { IoMdSend } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import clsx from "clsx";

const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-1 text-white">
      Thinking
      <div> </div>
      <div className="animate-bounce ">.</div>
      <div className="animate-bounce pb-0.1">.</div>
      <div className="animate-bounce pb-0.2">.</div>
    </div>
  );
};

const Message = ({
  avatar,
  start,
  name,
  time,
  message,
  status,
  show_status,
}) => {
  return (
    <div className={`chat ${start ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={avatar} />
        </div>
      </div>
      <div className="chat-header">
        {name}
        <time className="text-xs opacity-50 ml-2">{time}</time>
      </div>
      <div
        className={clsx("chat-bubble whitespace-pre-wrap", {
          "chat-bubble-info": !start,
          "chat-bubble-success": start,
        })}
      >
        {message}
      </div>
      {show_status ? (
        <div className="chat-footer opacity-50">
          {/* <>{status === Status.Thinking ? <LoadingDots /> : <>{status}</>}</> */}
          {status}
        </div>
      ) : null}
    </div>
  );
};

export default Message;
