import React, { createContext, useContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";

interface User {
  id: string;
  email: string;
  name: string;
  profileUrl: string;
  roles: string[];
  themePreference: string;
}

interface DashboardContextType {
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
}

const defaultValue: DashboardContextType = {
  isMobile: false,
  setIsMobile: () => {},
  user: null,
};

const DashboardContext = createContext<DashboardContextType>(defaultValue);

export function DashboardProvider({
  children,
  encryptedUserId,
}: {
  children: React.ReactNode;
  encryptedUserId: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!encryptedUserId) return;

    const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
    if (!ENCRYPTION_SECRET) {
      console.error("ENCRYPTION_SECRET not defined");
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedUserId, ENCRYPTION_SECRET);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setUser(decryptedData);
      console.log(decryptedData);
    } catch (error) {
      console.error("Failed to decrypt user data:", error);
    }
  }, [encryptedUserId]);

  return (
    <DashboardContext.Provider value={{ isMobile, setIsMobile, user }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);
