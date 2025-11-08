"use client";

import axios from "axios";
import { AxiosError } from "axios";
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

// interceptor to handle 401 -> try refresh once
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // avoid infinite loops, mark retries
    originalRequest._retry = originalRequest._retry || false;

    // If 401 and we haven't retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint (cookies sent automatically)
        await api.post("/api/refresh");
        // retry original request after refresh
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed -> redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
