import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../../features/chat/chatSlice";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import socket from "../../socket";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connected', 'disconnected', 'connecting'
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.chat.messages);
  const panelRef = useRef(null);

  // Open widget click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ✅ Initialize WebSocket when chat opens first time
  useEffect(() => {
    if (!open || socket.connected) return;

    setConnectionStatus("connecting");
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setConnectionStatus("connected");
    });

    socket.on("connect_error", () => {
      console.log("❌ Socket connection failed");
      setConnectionStatus("disconnected");
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
      setConnectionStatus("disconnected");
    });

    socket.on("message", (msg) => {
      // Push incoming messages to redux
      dispatch(addMessage({ from: "bot", text: msg, ts: Date.now() }));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("message");
      // socket.disconnect(); // optional: keep connected across open/close
    };
  }, [open, dispatch]);

  const handleSend = (text) => {
    dispatch(addMessage({ from: "user", text, ts: Date.now() }));
    socket.emit("message", text);
  };

  // Status indicator color
  const statusColor =
    connectionStatus === "connected"
      ? "bg-green-500"
      : connectionStatus === "connecting"
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-full shadow-lg focus:outline-none"
          aria-label="Open chat"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="w-80 h-96 bg-gray-900 text-gray-100 rounded-xl shadow-xl flex flex-col border border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              Budget Assistant
              {/* Status circle */}
              <span
                className={`w-3 h-3 rounded-full ${statusColor} inline-block`}
              />
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close chat"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <MessageList messages={messages} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-2">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
