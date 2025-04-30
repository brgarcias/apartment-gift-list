"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import ModalFeedback from "./Modal/Feedback";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      const timer = setTimeout(() => {
        setShowUnauthorized(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isLoading]);

  if (!isLoggedIn && showUnauthorized) {
    return <UnauthorizedAccess />;
  }

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <div className="nc-UnauthorizedAccess min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900">
      <ModalFeedback text="Verificando Acesso" isOpen={isLoading} />
    </div>
  );
}
