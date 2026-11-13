import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { authService } from "@/services/authService";
import {
  profileService,
  UserProfile,
} from "@/services/profileService";


interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();

      if (authenticated) {
        const profile = await profileService.getProfile();
        setUser(profile);
      }
    } catch {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
  try {
    console.log("1. Starting login...");

    const tokens = await authService.login({ email, password });
    console.log("2. Login successful:", {
      access: !!tokens.access,
      refresh: !!tokens.refresh,
    });

    const profile = await profileService.getProfile();
    console.log("3. Profile received:", profile);

    setUser(profile);
    console.log("4. User state updated.");

  } catch (error: any) {
    console.log("LOGIN ERROR STATUS:", error.response?.status);
    console.log("LOGIN ERROR DATA:", error.response?.data);
    console.log("LOGIN ERROR MESSAGE:", error.message);

    throw error;
  }
};

  const register = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }) => {
    await authService.register(data);
    await login(data.email, data.password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
  <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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
