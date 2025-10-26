import React from "react";
// import { formatDistanceToNow } from "date-fns";

const MessageItem = ({ message }) => {
  const isUser = message.from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] px-3 py-2 rounded-lg text-sm leading-relaxed
          ${
            isUser
              ? "bg-emerald-500 text-white rounded-br-md"
              : "bg-gray-800 text-gray-100 rounded-bl-md"
          }`}
      >
        <div>{message.text}</div>
      </div>
    </div>
  );
};

export default MessageItem;
