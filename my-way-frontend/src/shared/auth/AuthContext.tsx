import { createContext, useContext, useMemo, useState } from "react";

const TOKEN_KEY = "myway_token";
const NAME_KEY = "myway_name";
const AVATAR_KEY = "myway_avatar_url";

type AuthContextType = {
  token: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, fullName: string, avatarUrl: string | null) => void;
  updateProfileSession: (fullName: string, avatarUrl: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [fullName, setFullName] = useState<string | null>(() => localStorage.getItem(NAME_KEY));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => localStorage.getItem(AVATAR_KEY));

  const value = useMemo<AuthContextType>(() => ({
    token,
    fullName,
    avatarUrl,
    isAuthenticated: Boolean(token),
    setSession: (nextToken: string, nextFullName: string, nextAvatarUrl: string | null) => {
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(NAME_KEY, nextFullName);
      if (nextAvatarUrl) {
        localStorage.setItem(AVATAR_KEY, nextAvatarUrl);
      } else {
        localStorage.removeItem(AVATAR_KEY);
      }
      setToken(nextToken);
      setFullName(nextFullName);
      setAvatarUrl(nextAvatarUrl);
    },
    updateProfileSession: (nextFullName: string, nextAvatarUrl: string | null) => {
      localStorage.setItem(NAME_KEY, nextFullName);
      if (nextAvatarUrl) {
        localStorage.setItem(AVATAR_KEY, nextAvatarUrl);
      } else {
        localStorage.removeItem(AVATAR_KEY);
      }
      setFullName(nextFullName);
      setAvatarUrl(nextAvatarUrl);
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(AVATAR_KEY);
      setToken(null);
      setFullName(null);
      setAvatarUrl(null);
    },
  }), [avatarUrl, fullName, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
