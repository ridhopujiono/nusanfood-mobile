// src/api/client.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Optional logging
  console.log("API REQUEST:", {
    url: `${config.baseURL}${config.url}`,
    method: config.method,
    data: config.data,
    headers: config.headers,
  });

  return config;
});

// Normalize errors
http.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", response.status, response.data);
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    console.log("API ERROR:", status, data ?? error.message);

    const msg =
      data?.message ||
      data?.error ||
      error.message ||
      (status ? `Request failed (${status})` : "Request failed");

    return Promise.reject(new Error(msg));
  }
);

// Keep same interface your app already uses:
export const api = {
  get: async <T>(path: string, headers?: Record<string, string>) => {
    const res = await http.get<T>(path, { headers });
    return res.data;
  },
  post: async <T>(path: string, body?: unknown, headers?: Record<string, string>) => {
    const res = await http.post<T>(path, body, { headers });
    return res.data;
  },
  put: async <T>(path: string, body?: unknown, headers?: Record<string, string>) => {
    const res = await http.put<T>(path, body, { headers });
    return res.data;
  },
  patch: async <T>(path: string, body?: unknown, headers?: Record<string, string>) => {
    const res = await http.patch<T>(path, body, { headers });
    return res.data;
  },
  delete: async <T>(path: string, headers?: Record<string, string>) => {
    const res = await http.delete<T>(path, { headers });
    return res.data;
  },
};
