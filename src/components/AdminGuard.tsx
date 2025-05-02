"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import UnauthorizedAdminAccess from "@/components/UnauthorizedAdminAccess";
import ModalFeedback from "./Modal/Feedback";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !user?.isAdmin) {
      const timer = setTimeout(() => {
        setShowUnauthorized(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isLoading, user]);

  if (!isLoggedIn && showUnauthorized) {
    return <UnauthorizedAdminAccess />;
  }

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <div className="nc-UnauthorizedAdminAccess min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900">
      <ModalFeedback text="Verificando Acesso" isOpen={isLoading} />
    </div>
  );
}
