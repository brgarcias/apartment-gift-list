"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Route } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const pages: {
  name: string;
  link: Route;
}[] = [
  {
    name: "Informações",
    link: "/account",
  },
  {
    name: "Meus pedidos",
    link: "/account-order",
  },
];

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const SkeletonLoader = () => (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar py-5 md:py-8">
            {pages.map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        <div className="space-y-6">
          <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          <div className="h-40 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nc-AccountCommonLayout container">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-14 sm:mt-20">
              <div className="max-w-4xl mx-auto">
                <div className="max-w-2xl">
                  <h2 className="text-3xl xl:text-4xl font-semibold">Conta</h2>
                  <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">
                      {user?.name},
                    </span>{" "}
                    {user?.birthDate} · São Paulo, SP
                  </span>
                </div>
                <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

                <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
                  {pages.map((item, index) => {
                    return (
                      <Link
                        key={index}
                        href={item.link}
                        className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${
                          pathname === item.link
                            ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                <hr className="border-slate-200 dark:border-slate-700"></hr>
              </div>
            </div>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-20 lg:pb-32">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommonLayout;
