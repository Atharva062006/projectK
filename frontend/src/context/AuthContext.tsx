"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  is_approved: boolean;
  profile_image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  profileId: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshProfileId: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  profileId: null,
  login: () => {},
  logout: () => {},
  refreshProfileId: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  const fetchProfileId = async (userRole: string) => {
    if (userRole === "member" || userRole === "alumni") {
      try {
        const res = await api.profile.getMe();
        if (res.ok && res.data) {
          const profile = res.data as { profile_id: string; profile_image?: string };
          localStorage.setItem("pk_profile_id", profile.profile_id);
          setProfileId(profile.profile_id);
          if (profile.profile_image) {
            setUser((prev) => (prev ? { ...prev, profile_image: profile.profile_image } : prev));
          }
        }
      } catch (err) {
        console.error("Failed to load profile ID", err);
      }
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("pk_token");
    const u = localStorage.getItem("pk_user");
    const p = localStorage.getItem("pk_profile_id");
    if (t && u) {
      setToken(t);
      const parsedUser = JSON.parse(u);
      setUser(parsedUser);
      if (p) {
        setProfileId(p);
      } else {
        fetchProfileId(parsedUser.role);
      }
    }
  }, []);

  const login = (t: string, u: User) => {
    localStorage.setItem("pk_token", t);
    localStorage.setItem("pk_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
    fetchProfileId(u.role);
  };

  const logout = () => {
    localStorage.removeItem("pk_token");
    localStorage.removeItem("pk_user");
    localStorage.removeItem("pk_profile_id");
    setToken(null);
    setUser(null);
    setProfileId(null);
  };

  const refreshProfileId = async () => {
    if (user) {
      await fetchProfileId(user.role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, profileId, login, logout, refreshProfileId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
