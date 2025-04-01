"use client";

import { io } from "socket.io-client";
import { SERVER_URL } from "./data";

export const getSocket = (userId: string) =>
  io(SERVER_URL, { query: { userId: userId, userRole: "admin" } });
