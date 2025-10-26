// src/components/Chat/ChatInput.jsx
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="p-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50"
        aria-label="Send message"
      >
        <FiSend />
      </button>
    </form>
  );
};

export default ChatInput;
