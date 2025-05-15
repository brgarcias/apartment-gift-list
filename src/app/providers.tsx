"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { ToastProvider } from "@/contexts/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <FeedbackProvider>{children}</FeedbackProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
