"use client";

import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window === "undefined"
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}` // On Vercel server
      : "http://localhost:3000" // Local dev server
    : window.location.origin); // On browser

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
