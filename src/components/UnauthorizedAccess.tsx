"use client";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import {
  ArrowRightIcon,
  FaceSmileIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import backgroundPattern from "@/images/Moon.svg";
import Image from "next/image";
import ModalLogin from "./Modal/Login";
import { useState } from "react";

export default function UnauthorizedAccess() {
  const router = useRouter();
  const [openModalLogIn, setOpenModalLogIn] = useState(false);

  return (
    <div className="nc-UnauthorizedAccess min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900">
      <div className="relative w-full max-w-md">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
          <Image
            draggable="false"
            fill
            className="object-cover"
            src={backgroundPattern}
            alt="Padrão de fundo"
            priority
          />
        </div>

        {/* Content Card */}
        <div className="relative w-full bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <LockClosedIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Acesso Restrito
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Você precisa estar logado para acessar esta área do sistema.
            </p>

            {/* Info Box */}
            <div className="space-y-3 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FaceSmileIcon className="flex-shrink-0 h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Faça login para desbloquear todos os recursos e personalizar
                    sua experiência.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ButtonPrimary
                onClick={() => setOpenModalLogIn(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                Fazer Login
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </ButtonPrimary>

              <ButtonPrimary
                onClick={() => router.push("/")}
                className="bg-grey-50 dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"
              >
                Voltar à Página Inicial
              </ButtonPrimary>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-slate-700/50 px-8 py-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Problemas para acessar? Entre em contato com nosso{" "}
              <a
                href="https://api.whatsapp.com/send/?phone=5511996969301&text=Oi Todo Poderoso, não manjo nada de tecnologia.&type=phone_number&app_absent=0"
                target="_blank"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                suporte técnico
              </a>
            </p>
          </div>
        </div>
      </div>
      <ModalLogin isOpen={openModalLogIn} setIsOpen={setOpenModalLogIn} />
    </div>
  );
}
