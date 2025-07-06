import { useNavigate } from "@remix-run/react";
import { FaArrowLeft, FaCloudUploadAlt, FaUndo, FaRedo } from "react-icons/fa";
import { MdCloudOff, MdOutlineEdit } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IoCloudDoneOutline } from "react-icons/io5";
import {
  RiSignalWifiFill,
  RiSignalWifiOffLine,
  RiSignalWifi1Fill,
} from "react-icons/ri";
import { useState, useEffect } from "react";

// Animation variants for buttons
const buttonVariants = {
  active: {
    scale: 1.08,
    backgroundColor: "var(--md-sys-color-primary, #685496)",
    transition: {
      type: "spring",
      ease: "easeInOut",
      duration: 0.5,
    },
  },
  inactive: {
    scale: 1,
    backgroundColor: "transparent",
    transition: {
      type: "spring",
      ease: "easeInOut",
      duration: 0.5,
    },
  },
};

// Upward animation for status icons
const statusVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const modes = [
  { id: "edit", label: "Edit", icon: MdOutlineEdit, shortcut: "Ctrl+E" },
  { id: "view", label: "View", icon: FiEye, shortcut: "Ctrl+V" },
];

const fileStatus = {
  saved: <IoCloudDoneOutline className="text-green-500" />,
  failed: <MdCloudOff className="text-red-500" />,
  saving: <FaCloudUploadAlt className="animate-pulse text-blue-500" />,
};

const networkStatus = {
  offline: <RiSignalWifiOffLine className="text-red-500" />,
  halfOnline: <RiSignalWifi1Fill className="text-yellow-500" />,
  online: <RiSignalWifiFill className="text-green-500" />,
};

interface HeaderProps {
  title: string;
  mode: "edit" | "view";
  setMode: (mode: "edit" | "view") => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => Promise<boolean>;
  toggleSideSheet?: (id: string) => void; // Made optional
  openSideSheet?: string | null; // Already optional
}

const Header: React.FC<HeaderProps> = ({
  title,
  mode,
  setMode,
  onUndo,
  onRedo,
  onSave,
  toggleSideSheet,
  openSideSheet,
}) => {
  const navigate = useNavigate();
  const editControls = useAnimation();
  const viewControls = useAnimation();
  const [networkState, setNetworkState] =
    useState<keyof typeof networkStatus>("online");
  const [fileState, setFileState] = useState<keyof typeof fileStatus>("saved");
  const [prevNetworkState, setPrevNetworkState] =
    useState<keyof typeof networkStatus>("online");
  const [prevFileState, setPrevFileState] =
    useState<keyof typeof fileStatus>("saved");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Debug: Log toggleSideSheet to verify it's a function
  useEffect(() => {
    console.log(
      "toggleSideSheet prop:",
      typeof toggleSideSheet,
      toggleSideSheet
    );
  }, [toggleSideSheet]);

  // Handle network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      const newState = navigator.onLine ? "online" : "offline";
      const simulatedHalfOnline = Math.random() < 0.2;
      const finalState = !navigator.onLine
        ? "offline"
        : simulatedHalfOnline
        ? "halfOnline"
        : "online";
      if (finalState !== networkState) {
        setPrevNetworkState(networkState);
        setNetworkState(finalState);
      }
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    updateNetworkStatus();
    const interval = setInterval(updateNetworkStatus, 10000);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      clearInterval(interval);
    };
  }, [networkState]);

  // Handle auto-saving
  useEffect(() => {
    if (!isAutoSaving || !onSave) return;

    const autoSaveInterval = setInterval(async () => {
      setPrevFileState(fileState);
      setFileState("saving");
      const success = await onSave();
      setFileState(success ? "saved" : "failed");
      setTimeout(() => {
        setPrevFileState(fileState);
        setFileState("saved");
      }, 2000);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [isAutoSaving, onSave, fileState]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        handleModeChange("edit");
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        handleModeChange("view");
      }
      if (e.ctrlKey && e.key === "z" && onUndo) {
        e.preventDefault();
        onUndo();
      }
      if (e.ctrlKey && e.key === "y" && onRedo) {
        e.preventDefault();
        onRedo();
      }
      if (e.ctrlKey && e.key === "s" && onSave) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUndo, onRedo, onSave]);

  // Handle mode change
  const handleModeChange = async (newMode: "edit" | "view") => {
    setMode(newMode);
    const activeControls = newMode === "edit" ? editControls : viewControls;
    const inactiveControls = newMode === "edit" ? viewControls : editControls;

    await Promise.all([
      activeControls.start("active"),
      inactiveControls.start("inactive"),
    ]);
  };

  // Handle manual save
  const handleSave = async () => {
    if (onSave) {
      setPrevFileState(fileState);
      setFileState("saving");
      const success = await onSave();
      setFileState(success ? "saved" : "failed");
      setTimeout(() => {
        setPrevFileState(fileState);
        setFileState("saved");
      }, 2000);
    }
  };

  // Determine when to animate based on critical states
  const shouldAnimateNetwork =
    ["halfOnline", "offline"].includes(networkState) &&
    networkState !== prevNetworkState;
  const shouldAnimateFile =
    ["saving", "failed"].includes(fileState) && fileState !== prevFileState;

  return (
    <nav className="w-full h-14 px-6 py-3 flex items-center justify-between bg-dark border-b border-gray-300 dark:border-zinc-700 fixed top-0 left-0 z-40 transition-colors duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        <motion.button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-gray-900 dark:text-neutral-200 text-lg" />
        </motion.button>
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={fileState}
              variants={shouldAnimateFile ? statusVariants : undefined}
              initial={shouldAnimateFile ? "initial" : undefined}
              animate={shouldAnimateFile ? "animate" : undefined}
              exit={shouldAnimateFile ? "exit" : undefined}
              aria-label={`File status: ${fileState}`}
            >
              {fileStatus[fileState]}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={networkState}
              variants={shouldAnimateNetwork ? statusVariants : undefined}
              initial={shouldAnimateNetwork ? "initial" : undefined}
              animate={shouldAnimateNetwork ? "animate" : undefined}
              exit={shouldAnimateNetwork ? "exit" : undefined}
              aria-label={`Network status: ${networkState}`}
            >
              {networkStatus[networkState]}
            </motion.div>
          </AnimatePresence>
          <span
            className={`text-sm font-medium font-comfortaa ${
              isAutoSaving
                ? "text-green-500"
                : "text-gray-500 dark:text-neutral-500"
            }`}
            aria-label={`Auto-save ${isAutoSaving ? "enabled" : "disabled"}`}
          >
            Auto-Save: {isAutoSaving ? "On" : "Off"}
          </span>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-200 font-comfortaa">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUndo}
          disabled={!onUndo}
          aria-label="Undo action"
        >
          <FaUndo className="text-gray-900 dark:text-neutral-200 text-lg" />
        </motion.button>
        <motion.button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRedo}
          disabled={!onRedo}
          aria-label="Redo action"
        >
          <FaRedo className="text-gray-900 dark:text-neutral-200 text-lg" />
        </motion.button>
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              className={`text-sm h-8 w-24 flex items-center justify-center border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-neutral-200 font-medium font-comfortaa ${
                mode === m.id
                  ? "rounded-full bg-[var(--md-sys-color-primary)] text-white"
                  : "rounded-md"
              }`}
              variants={buttonVariants}
              initial={mode === m.id ? "active" : "inactive"}
              animate={m.id === "edit" ? editControls : viewControls}
              onClick={() => handleModeChange(m.id as "edit" | "view")}
              aria-label={`Switch to ${m.label.toLowerCase()} mode (${
                m.shortcut
              })`}
            >
              <Icon className="mr-1" /> <span>{m.label}</span>
            </motion.button>
          );
        })}
        <button
          onClick={() => {
            console.log("Hello", openSideSheet);
            toggleSideSheet?.("settings");
          }}
        >
          Hello
        </button>
        {toggleSideSheet && (
          <>
            <motion.button
              className={`h-10 w-24 flex items-center justify-center rounded-full text-sm font-medium font-comfortaa ${
                openSideSheet === "control"
                  ? "bg-[var(--md-sys-color-primary)] text-white"
                  : "text-gray-900 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSideSheet("control")}
              aria-label={
                openSideSheet === "control"
                  ? "Close control panel"
                  : "Open control panel"
              }
            >
              <HiMenu className="mr-1" /> Control
            </motion.button>
            <motion.button
              className={`h-10 w-24 flex items-center justify-center rounded-full text-sm font-medium font-comfortaa ${
                openSideSheet === "settings"
                  ? "bg-[var(--md-sys-color-primary)] text-white"
                  : "text-gray-900 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSideSheet("settings")}
              aria-label={
                openSideSheet === "settings"
                  ? "Close settings panel"
                  : "Open settings panel"
              }
            >
              <HiMenu className="mr-1" /> Settings
            </motion.button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
