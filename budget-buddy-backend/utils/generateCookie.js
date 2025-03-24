import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const generateCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  res.cookie("session", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development",
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateCookie;
