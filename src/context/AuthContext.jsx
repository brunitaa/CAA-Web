import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginAdminRequest,
  registerAdminRequest,
  getProfileRequest,
  logoutRequest,
  verifyTokenRequest,
} from "../api/auth.admin";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // ✅ Verifica si hay sesión activa al cargar la app
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileRequest(); // { data: { userId, role, ... } }
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const signupAdmin = async (userData) => {
    try {
      const res = await registerAdminRequest(userData);
      return res.data;
    } catch (error) {
      setErrors([error.response?.data?.message || "Error desconocido"]);
    }
  };

  const signinAdmin = async (credentials) => {
    try {
      await loginAdminRequest(credentials); // crea cookie
      const res = await getProfileRequest(); // obtiene perfil desde cookie
      setUser(res.data);
      return res.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const validateToken = async () => {
    try {
      const res = await verifyTokenRequest();
      if (res.data.valid) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout error:", error.response?.data);
    } finally {
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        errors,
        signupAdmin,
        signinAdmin,
        logout,
        isAdmin,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
