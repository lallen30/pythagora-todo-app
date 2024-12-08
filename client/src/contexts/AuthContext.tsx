import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "@/api/auth";
import api from "@/api/api";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.error || "Login failed");
      }
    } catch (error) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await apiRegister(email, password);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.error || "Registration failed");
      }
    } catch (error) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}