"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export function Toast({ message, type, onClose, duration = 6000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center mb-1 pointer-events-none animate-fade-in-up">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white max-w-xs md:max-w-md pointer-events-auto`}
      >
        {type === "success" ? (
          <CheckCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
        ) : (
          <ExclamationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
        )}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
