"use client";

import React, { FC, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import LangDropdown from "./LangDropdown";
import AvatarDropdown from "./AvatarDropdown";
import TemplatesDropdown from "./TemplatesDropdown";
import DropdownCategories from "./DropdownCategories";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import SwitchDarkMode from "@/shared/SwitchDarkMode/SwitchDarkMode";

export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = "" }) => {
  return (
    <div className="nc-MainNav2 relative z-10 bg-white dark:bg-slate-900 ">
      <div className="container">
        <div className="h-20 flex justify-between">
          <div className="flex items-center md:hidden flex-1">
            <MenuBar />
          </div>

          <div className="flex lg:flex-1 items-center space-x-3 sm:space-x-8">
            <Logo />
            <div className="hidden md:block h-10 border-l border-slate-200 dark:border-slate-700"></div>
            <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
          </div>

          <div className="flex-1 flex items-center justify-end ">
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
