"use client";

import React, { FC, Fragment, useRef } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";

export interface ModalProps {
  isOpen: boolean;
  setisOpen: (value: boolean) => void;
}

const ModalParty: FC<ModalProps> = ({ isOpen, setisOpen }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setisOpen(false)}
        static
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 backdrop-blur-sm pointer-events-none" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            className="inline-block w-full max-w-2xl py-10 px-4"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-flex flex-col w-full text-left align-middle transition-all transform bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-white leading-tight"
                >
                  Chá de Casa Nova & Noivado
                </Dialog.Title>
                <p className="mt-2 text-indigo-100">
                  1 de Outubro de 2025, às 13h, quadra de futebol
                </p>
                <ButtonClose className="absolute right-3 top-3 opacity-0 w-0 h-0 overflow-hidden" />
              </div>

              <div className="flex-grow overflow-y-auto p-6 sm:p-8">
                <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
                  <p>
                    A festa será realizada na quadra de futebol do bairro, com
                    decoração temática e atividades para todas as idades.
                  </p>
                  <p>
                    Teremos música ao vivo, comida deliciosa e muitas surpresas
                    para todos os convidados.
                  </p>
                  <p>
                    Venha celebrar conosco e fazer parte desse momento tão
                    especial!
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 flex justify-center border-t border-neutral-200 dark:border-neutral-700">
                <ButtonPrimary
                  onClick={() => setisOpen(false)}
                  sizeClass="px-6 py-3"
                  className="bg-indigo-600 hover:bg-indigo-100 dark:bg-indigo-700 dark:hover:bg-indigo-300"
                >
                  Fechado. Estarei lá!
                </ButtonPrimary>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalParty;
