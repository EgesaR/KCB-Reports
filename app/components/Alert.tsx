import React from "react";

type AlertProps = {
  type: "info" | "success" | "warning" | "danger";
  message: string;
};

export default function Alert({ type, message }: AlertProps) {
  // Define styles based on the alert type
  const styles = {
    info: "text-gray-900 bg-gray-50",
    success: "text-emerald-500 bg-emerald-50",
    warning: "text-amber-500 bg-amber-50",
    danger: "text-red-500 bg-red-50",
  };

  // Define the alert title based on the type
  const titles = {
    info: "Alert",
    success: "Success",
    warning: "Warning",
    danger: "Danger",
  };

  return (
    <div
      className={`p-4 mb-4 text-sm rounded-xl font-normal ${styles[type]}`}
      role="alert"
    >
      <span className="font-semibold mr-2">{titles[type]}</span>
      {message}
    </div>
  );
}
