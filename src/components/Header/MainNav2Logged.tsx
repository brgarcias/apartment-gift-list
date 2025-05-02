"use client";

import React, { FC } from "react";
import Logo from "@/shared/Logo/Logo";
import AvatarDropdown from "./AvatarDropdown";
import SwitchDarkMode from "@/shared/SwitchDarkMode/SwitchDarkMode";

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  return (
    <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
      <div className="container ">
        <div className="h-20 flex justify-between">
          <div className="flex items-center lg:hidden flex-1">
            <span className="block">
              <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            </span>
          </div>

          <div className="lg:flex-1 flex items-center">
            <Logo className="flex-shrink-0" />
            <div className="hidden lg:block mx-1 h-10 border-l border-slate-200 dark:border-slate-700"></div>
            <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800 hidden lg:flex" />
          </div>

          <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
