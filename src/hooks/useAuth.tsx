import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios"; // tu instancia de axios

export interface User {
  userId: number;
  username: string;
  role: "admin" | "caregiver" | "speaker";
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get<User>("/auth/profile", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const login = async () => {
    await fetchProfile(); // después del login backend guarda cookie
  };

  const logout = useCallback(async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isCaregiver = user?.role === "caregiver";
  const isSpeaker = user?.role === "speaker";

  return { user, login, logout, fetchProfile, isAdmin, isCaregiver, isSpeaker };
}
