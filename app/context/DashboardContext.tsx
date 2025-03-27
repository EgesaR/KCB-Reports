import React, { createContext, useContext, useState } from "react";

// Define the type for your context
interface DashboardContextType {
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

// Provide a default value for the context
const defaultValue: DashboardContextType = {
  isMobile: false,
  setIsMobile: () => {}, // A placeholder function
};

// Create the context with the proper type
export const DashboardContext =
  createContext<DashboardContextType>(defaultValue);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <DashboardContext.Provider value={{ isMobile, setIsMobile }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}
