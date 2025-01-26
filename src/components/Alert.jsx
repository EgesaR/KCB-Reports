import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";

const Alert = ({ alertBody, id, setAlerts, status = "info", sleep=12, icon }) => {
  const [show, setShow] = useState(false);

  // Map status to corresponding colors
  const statusColors = {
    success: {
      color: {
        light: "text-green-800",
        dark: "dark:text-green-400"
      },
      bg: "bg-green-50",
      hover_bg: "hover:bg-green-200",
      iconColor: "text-green-500"
    },
    error: {
      color: {
        light: "text-red-800",
        dark: "dark:text-red-400"
      },
      bg: "bg-red-50 to-white",
      hover_bg: "hover:bg-red-200",
      iconColor: "text-red-500"
    },
    warning: {
      color: {
        light: "text-yellow-800",
        dark: "dark:text-yellow-400"
      },
      bg: "bg-yellow-50 to-white",
      hover_bg: "hover:bg-yellow-200",
      iconColor: "text-yellow-500"
    },
    info: {
      color: {
        light: "text-blue-800",
        dark: "dark:text-blue-400"
      },
      bg: "bg-blue-50 to-white",
      hover_bg: "hover:bg-blue-200",
      iconColor: "text-blue-500"
    },
  };

  const colorObj = statusColors[status];

  const removeAlert = () => {
    setShow(false);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 400); // Match transition duration
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    },250)
    //Count down to setShow to false
    setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      },350)
    }, sleep*1000)
  });

  return (
    <div
      id={id}
      className={`alert flex items-center p-4 mb-4 ${colorObj.color.light} rounded-lg ${colorObj.bg} dark:bg-gray-800 ${colorObj.color.dark} transition-transform duration-300 ${
        show ? "translate-x-0" : "translate-x-[110%]"
      }`}
      role="alert"
    >
      {icon}
      <div className="ms-3 text-sm font-medium">{alertBody}</div>
      <button
        type="button"
        className={`ms-auto -mx-1.5 -my-1.5 ${colorObj.bg} ${colorObj.iconColor} rounded-full p-1.5 ${colorObj.hover_bg} inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 ${colorObj.color.dark} dark:hover:bg-gray-700`}
        ariaLabel="Close alert"
        onClick={removeAlert}
      >
        <span className="sr-only">Close</span>
        <FaX className="w-3 h-3" />
      </button>
    </div>
  );
};

export default Alert;
