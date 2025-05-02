"use client";

import React, { FC, Fragment, useRef } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import Badge from "@/shared/Badge/Badge";

export interface ModalProps {
  isOpenMoreFilter: boolean;
  setisOpenMoreFilter: (value: boolean) => void;
}

interface StepItem {
  number: string;
  title: string;
  description: string | JSX.Element;
}

const steps: StepItem[] = [
  {
    number: "1",
    title: "Escolha Seu Presente",
    description:
      "Navegue pela nossa lista de presentes mobiliando nosso lar. Use os filtros para encontrar opções por categoria, faixa de preço ou disponibilidade.",
  },
  {
    number: "2",
    title: "Ver Detalhes",
    description: (
      <>
        Clique em <Badge className="px-2 py-1" name="Ver Detalhes" /> para ver
        fotos, descrição completa e o link da loja onde o item está disponível
        (Amazon, Mercado Livre, etc).
      </>
    ),
  },
  {
    number: "3",
    title: "Compre no Site Parceiro",
    description:
      "A compra é feita diretamente no site do vendedor. Você tem toda segurança e garantia da plataforma escolhida.",
  },
  {
    number: "4",
    title: "Nos Avise Que Comprou",
    description: (
      <>
        Depois de comprar, clique em{" "}
        <Badge className="px-2 py-1 mr-1" name="Comprar Este Presente" /> para
        registrarmos seu nome. Assim saberemos quem nos presenteou com cada item
        especial!
      </>
    ),
  },
  {
    number: "5",
    title: "Faça Login ou Cadastre-se",
    description:
      "Para registrar seu presente, você precisará fazer login ou criar uma conta. Isso garante que sua compra seja registrada corretamente e que possamos agradecer pessoalmente.",
  },
  {
    number: "6",
    title: "Entrega do Presente",
    description:
      "O presente pode ser entregue na festa ou combine com os noivos. Não se preocupe, não abriremos o presente antes do evento!",
  },
];

const Modal: FC<ModalProps> = ({ isOpenMoreFilter, setisOpenMoreFilter }) => {
  return (
    <Transition appear show={isOpenMoreFilter} as={Fragment}>
      <Dialog
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
                <ButtonClose className="absolute right-3 top-3 opacity-0 w-0 h-0 overflow-hidden" />
              </div>

              <div className="flex-grow overflow-y-auto p-6 sm:p-8">
                <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full pt-1 pb-1 pl-2 pr-2 mr-4">
                        <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                          {step.number}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 flex justify-center border-t border-neutral-200 dark:border-neutral-700">
                <ButtonPrimary
                  onClick={() => setisOpenMoreFilter(false)}
                  sizeClass="px-6 py-3"
                  className="bg-indigo-600 hover:bg-indigo-100 dark:bg-indigo-700 dark:hover:bg-indigo-300"
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
