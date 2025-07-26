import { createContext, useContext, useState, type ReactNode } from "react";

interface ReportContextType {
  mode: "edit" | "view";
  setMode: (mode: "edit" | "view") => void;
  openSideSheet: string | null;
  toggleSideSheet: (id: string) => void;
  handleSave: () => Promise<boolean>;
  handleUndo: () => void;
  handleRedo: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [openSideSheet, setOpenSideSheet] = useState<string | null>(null);

  const handleSave = async (): Promise<boolean> => {
    console.log("Saving...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  const handleUndo = (): void => {
    console.log("Undo action");
  };

  const handleRedo = (): void => {
    console.log("Redo action");
  };

  const toggleSideSheet = (id: string) => {
    console.log(
      "Toggling SideSheet:",
      id,
      "Current openSideSheet:",
      openSideSheet
    );
    setOpenSideSheet((prev) => (prev === id ? null : id));
  };

  return (
    <ReportContext.Provider
      value={{
        mode,
        setMode,
        openSideSheet,
        toggleSideSheet,
        handleSave,
        handleUndo,
        handleRedo,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
}
