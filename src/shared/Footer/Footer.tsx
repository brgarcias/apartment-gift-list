import Logo from "@/shared/Logo/Logo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import React from "react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  return (
    <div className="nc-Footer relative py-5 lg:pt-28 lg:pb-24 border-t border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 xl:gap-x-20">
        <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:col-span-1 lg:block">
          <div className="col-span-2 md:col-span-1 lg:mb-10">
            <Logo />
          </div>
          <div className="col-span-2 flex items-center justify-end md:col-span-3 lg:block">
            <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" />
          </div>
        </div>

        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
            Informações
          </h2>
          <ul className="mt-5 space-y-4">
            <li>
              <a
                href="#"
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                Como Funciona
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
            Contato
          </h2>
          <ul className="mt-5 space-y-4">
            <li className="text-neutral-6000 dark:text-neutral-300">
              amanda0bruno@gmail.com
            </li>
            <li className="text-neutral-6000 dark:text-neutral-300">
              +55 (11) 99696-9301
            </li>
            <li className="text-neutral-6000 dark:text-neutral-300">
              +55 (11) 99624-0704
            </li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-2 lg:col-span-2 lg:text-right">
          <div className="text-sm text-neutral-6000 dark:text-neutral-300">
            © {new Date().getFullYear()} All rights reserved. Made with ❤️ by{" "}
            <a
              href="https://brgarcias-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white"
            >
              brgarcias
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
