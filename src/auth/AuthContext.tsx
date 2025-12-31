import React, { createContext, useContext, useMemo, useState } from "react";

type User = {
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Dummy credentials for now
const DUMMY_EMAIL = "test@test.com";
const DUMMY_PASSWORD = "123456";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    if (email.trim().toLowerCase() === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
        setUser({ email: email.trim().toLowerCase() });
        return;
    }

    throw new Error("Email or password is wrong");
    } catch (e: any) {
    setError(e?.message ?? "Login failed");
    } finally {
    setIsLoading(false);
    }

    };


  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, logout, isLoading, error }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
