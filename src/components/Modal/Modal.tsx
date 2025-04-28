"use client";

import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Dialog, Transition } from "@headlessui/react";

export interface ModalProps {
  isOpenMoreFilter: boolean;
  setisOpenMoreFilter: (value: boolean) => void;
}

const Modal: FC<ModalProps> = ({ isOpenMoreFilter, setisOpenMoreFilter }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpenMoreFilter && modalContentRef.current) {
      modalContentRef.current.scrollTo(0, 0);
    }
  }, [isOpenMoreFilter]);
  return (
    <Transition appear show={isOpenMoreFilter} as={Fragment}>
      <Dialog
        ref={modalContentRef}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setisOpenMoreFilter(false)}
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
                  Como Funciona Nossa Lista de Presentes
                </Dialog.Title>
                <p className="mt-2 text-indigo-100">
                  Um guia simples para você nos presentear
                </p>
              </div>

              <div className="flex-grow overflow-y-auto p-6 sm:p-8">
                <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-2 mr-4">
                      <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                        Escolha Seu Presente
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Navegue pela nossa lista de presentes mobiliando nosso
                        lar. Use os filtros para encontrar opções por categoria,
                        faixa de preço ou disponibilidade.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-2 mr-4">
                      <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                        Ver Detalhes
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Clique em &quot;Ver Detalhes&quot; para ver fotos,
                        descrição completa e o link da loja onde o item está
                        disponível (Amazon, Mercado Livre, etc).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-2 mr-4">
                      <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                        Compre no Site Parceiro
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        A compra é feita diretamente no site do vendedor. Você
                        tem toda segurança e garantia da plataforma escolhida.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-2 mr-4">
                      <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                        4
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                        Nos Avisa Que Comprou
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Depois de comprar, clique em &quot;Comprar Este
                        Presente&quot; para registrarmos seu nome. Assim
                        saberemos quem nos presenteou com cada item especial!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 flex justify-center border-t border-neutral-200 dark:border-neutral-700">
                <ButtonPrimary
                  onClick={() => setisOpenMoreFilter(false)}
                  sizeClass="px-6 py-3"
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  Entendi, vamos começar!
                </ButtonPrimary>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
