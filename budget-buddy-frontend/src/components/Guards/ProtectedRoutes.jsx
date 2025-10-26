import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatWidget from "../chat/ChatWidget";

const ProtectedRoutes = () => {
  const userIsVerified = useSelector((state) => state.auth?.user?.verified);

  return userIsVerified ? (
    <>
      {/* All protected routes render here */}
      <Outlet />

      {/* ✅ Floating Chat Widget available everywhere */}
      <ChatWidget />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;
