"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Define Admin data types
interface AdminData {
  id: string;
  email: string;
  name: string;
  businessName: string;
  logo: string;
  createdAt: Date;
}

interface AdminContextType {
  admin: AdminData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchAdmin: () => void;
}

const UserContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
  token?: string | null;
}

export const UserProvider = ({ children, token }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user", {
        method: "GET",
      });
      if (!res.ok) {
        setAdmin(null);
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setAdmin(data.user ?? null);
      setIsAuthenticated(!!data.admin);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      setAdmin(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);

      // Validate admin token on startup
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await fetchUser();
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [token, fetchUser]);

  const value: AdminContextType = {
    admin,
    isLoading,
    isAuthenticated,
    refetchAdmin: fetchUser,
  };

  if (!token) {
    router.push("/sign-in");
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the AdminContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
