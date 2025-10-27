// src/socket.js
import { io } from "socket.io-client";

const baseSocketURL = import.meta.env.VITE_BACKEND_API_URL.replace(/\/api\/v1\/?$/, "");

const socket = io(baseSocketURL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
