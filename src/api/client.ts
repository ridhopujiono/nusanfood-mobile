// src/api/client.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  const authHeader = await getAuthHeader();

  // 🔍 LOG REQUEST
  console.log("API REQUEST:", {
    url: `${API_BASE_URL}${path}`,
    method,
    body,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...extraHeaders,
    },
  });

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  // 🔍 LOG RAW RESPONSE
  console.log("API RAW RESPONSE:", res.status, text);

  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    console.log("API PARSED ERROR:", json);
    const msg =
      (json && (json.message || json.error)) ||
      text ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  console.log("API PARSED SUCCESS:", json);
  return json as T;
}


export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, "GET", undefined, headers),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, "POST", body, headers),
};
