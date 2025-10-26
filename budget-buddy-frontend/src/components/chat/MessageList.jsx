import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [] }) => {
  const endRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-3">
      {messages.length === 0 && (
        <div className="text-xs text-gray-400">
          Say hi 👋 — ask about incomes, expenses.
        </div>
      )}
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
