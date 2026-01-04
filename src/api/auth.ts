// src/api/auth.ts
import { api } from "./client";

export type LoginResponse = {
  access_token: string;
  token_type?: string;
  user?: {
    id?: string | number;
    email?: string;
    name?: string;
  };
};


export async function loginApi(email: string, password: string) {
  return api.post<LoginResponse>("/auth/login", { email, password });
}

export type RegisterResponse = {
  access_token?: string;
  token_type?: string;
  user?: {
    id?: string | number;
    email?: string;
    name?: string;
  };
  message?: string;
};

export async function registerApi(name: string, email: string, password: string) {
  return api.post<RegisterResponse>("/auth/register", { name, email, password });
}