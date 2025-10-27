// src/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_API_URL, {
  autoConnect: false, // connect manually
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
