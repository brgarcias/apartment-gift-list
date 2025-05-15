"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white dark:bg-slate-900">
      <motion.main
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-8">
          <div className="mb-8 mx-auto max-w-[150px] relative">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="w-full h-full"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="100" cy="100" r="90" fill="url(#gradient)" />

              <motion.path
                d="M100 25 L175 175 L25 175 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-red-500 dark:text-red-600"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />

              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <rect
                  x="95"
                  y="70"
                  width="10"
                  height="45"
                  className="fill-red-500 dark:fill-red-600"
                />
                <circle
                  cx="100"
                  cy="130"
                  r="8"
                  className="fill-red-500 dark:fill-red-600"
                />
              </motion.g>

              <path
                d="M100 90 L110 80 L105 95 L115 90"
                stroke="currentColor"
                strokeWidth="2"
                className="text-red-300 dark:text-red-900"
              />

              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    className="stop-color-red-100 dark:stop-color-red-900/30"
                  />
                  <stop
                    offset="100%"
                    className="stop-color-red-50 dark:stop-color-red-900/10"
                  />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <motion.h1
              className="text-2xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Oops! Erro inesperado
            </motion.h1>

            <p className="text-md text-gray-600 dark:text-gray-300 leading-8">
              Algo não saiu como esperado. Não se preocupe, nossa equipe já foi
              notificada. Você pode tentar recarregar a página.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ButtonPrimary
                onClick={() => reset()}
                className="w-full sm:w-auto px-4 py-4 text-lg"
              >
                Tentar novamente
              </ButtonPrimary>
            </motion.div>

            {process.env.NODE_ENV === "development" && (
              <motion.div
                className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h2 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                  Detalhes do erro:
                </h2>
                <p className="font-mono text-sm text-red-600 dark:text-red-400">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 font-mono text-sm text-red-600 dark:text-red-400">
                    Digest: {error.digest}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
