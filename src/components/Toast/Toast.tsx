"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
};

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!visible) return null;

  // Configurações de estilo baseadas no tipo
  const toastConfig = {
    success: {
      bg: "bg-green-500",
      icon: <CheckCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />,
    },
    error: {
      bg: "bg-red-500",
      icon: <ExclamationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />,
    },
    info: {
      bg: "bg-blue-500",
      icon: <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />,
    },
    warning: {
      bg: "bg-yellow-500",
      icon: <ExclamationTriangleIcon className="h-6 w-6 mr-2 flex-shrink-0" />,
    },
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center mb-1 pointer-events-none animate-fade-in-up">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg ${toastConfig[type].bg} text-white max-w-xs md:max-w-md pointer-events-auto`}
      >
        {toastConfig[type].icon}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
