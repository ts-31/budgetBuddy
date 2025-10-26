import React from "react";
import { formatDistanceToNow } from "date-fns";

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
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {formatDistanceToNow(new Date(message.ts), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
