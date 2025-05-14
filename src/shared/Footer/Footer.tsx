"use client";

import Logo from "@/shared/Logo/Logo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import ModalParty from "@/components/Modal/Party";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOpenModalParty, setisOpenModalParty] = useState(false);

  return (
    <footer className="nc-Footer bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
      <div className="container mx-auto px-4 py-6 lg:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-40 h-auto">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed opacity-80 max-w-md">
              Nos ajude a construir nossa casa com o presente perfeito. Navegue
              por nossa seleção de presentes e faça a gente feliz!
            </p>
            <div className="flex space-x-4 lg:space-x-6">
              <SocialsList1 className="flex items-center space-x-4" />
            </div>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2 uppercase tracking-wider">
              Informações
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  onClick={() => setisOpenModalParty(true)}
                  className="transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="About us"
                >
                  Sobre a Festa
                </a>
              </li>
              <li>
                <a
                  onClick={() => setisOpenMoreFilter(true)}
                  className="transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="How it works"
                >
                  Como Funciona
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2 uppercase tracking-wider">
              Contato
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mt-0.5 mr-3 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:amanda0bruno@gmail.com"
                  className="transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  amanda0bruno@gmail.com
                </a>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mt-0.5 mr-3 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="space-y-1">
                  <a
                    href="https://api.whatsapp.com/send/?phone=5511996969301&text=Oi Mestre lindão, tenho uma dúvida sobre o noivado.&type=phone_number&app_absent=0"
                    className="block transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Bruno contact"
                  >
                    +55 (11) 99696-9301{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-1 transition-colors duration-200">
                      (Bruno)
                    </span>
                  </a>
                  <a
                    href="https://api.whatsapp.com/send/?phone=5511996240704&text=Oi Amanda, quero fazer uma fofoca 🤭.&type=phone_number&app_absent=0"
                    className="block transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Amanda contact"
                  >
                    +55 (11) 99624-0704{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-1 transition-colors duration-200">
                      (Amanda)
                    </span>
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm opacity-80 mb-4 md:mb-0">
            © {currentYear} All rights reserved.
          </div>
          <div className="text-sm">
            Made with <span className="text-red-500">❤️</span> by{" "}
            <a
              href="https://brgarcias-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
              aria-label="Visit developer's portfolio"
            >
              brgarcias
            </a>
          </div>
        </div>
      </div>

      <Modal
        isOpenMoreFilter={isOpenMoreFilter}
        setisOpenMoreFilter={setisOpenMoreFilter}
      />

      <ModalParty isOpen={isOpenModalParty} setisOpen={setisOpenModalParty} />
    </footer>
  );
};

export default Footer;
