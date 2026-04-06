"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Mock User Data
export type User = {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  isMember: true; // Used to restrict profile editing (FR-2.1)
};

type AuthContextType = {
  user: User | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USER: User = {
  id: "u123",
  name: "Alex Jordan",
  role: "Full-Stack Architect",
  photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGdMXC86tMDQwyEWEUoL4Fk5UVlS__rbdHwAcT7biGJyrAINgslboj_mY-59f6dLenK8VpiNIUS_-g9X1RnfKfzFZtXfJoeN1V1o0A4h6dhcPa06WLT0b-gN6u2yAiUxvp_vAHx2SKGnB-Ah9UTiieFtpeI26H71Dk1SRlHwJoLdJAfvQJmnWUEnFyTrqLn1y56oP1QrKUehHOZ2eFudtCE-kL_lefTPFSVmKxE6KG9XWxpEivACE-1_msj6e-OZMp6w7cbML7I78L",
  isMember: true,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => setUser(DUMMY_USER); // Log in as test user
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
