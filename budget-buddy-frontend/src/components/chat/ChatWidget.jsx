import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../../features/chat/chatSlice";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.chat.messages);
  const panelRef = useRef(null);

  //  Close widget if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  //  Handle sending a message (local only for now)
  const handleSend = (text) => {
    dispatch(addMessage({ from: "user", text }));
    // Later, you’ll emit to backend via WebSocket here
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-full shadow-lg focus:outline-none"
          aria-label="Open chat"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="w-80 h-96 bg-gray-900 text-gray-100 rounded-xl shadow-xl flex flex-col border border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <h2 className="text-sm font-semibold">Budget Assistant 💬</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close chat"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <MessageList messages={messages} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-2">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
