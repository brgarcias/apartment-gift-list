"use client";

import React, { FC, Fragment, useRef, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import Label from "../Label/Label";
import Input from "@/shared/Input/Input";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useAuth } from "@/contexts/AuthContext";

export interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ModalLogin: FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [fullName, setFullName] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("1999-12-15");
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();
  const { login: authLogin } = useAuth();

  const login = async () => {
    showFeedback("Entrando", true);
    if (!fullName || !birthDate) {
      showToast(
        "Opa, opa, opa, perai! Preencha todos os campos por favor, meu rei.",
        "error"
      );
      showFeedback("", false);
      return;
    }
    setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NETLIFY_URL}/auth/signin`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: fullName,
              birthDate: new Date(birthDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
            }),
          }
        );
        if (res.ok) {
          const userData = await res.json();
          authLogin(userData);

          setIsOpen(false);
          showToast(
            "Bem vindo camarada! Pode comprar quantos presentes quiser.",
            "success"
          );
        } else {
          throw new Error(await res.text());
        }
      } catch (error) {
        console.error("Sign in error:", error);
        showToast(
          "Opa, algo deu errado amigo. Tente de novo aí por favor.",
          "error"
        );
      } finally {
        showFeedback("", false);
      }
    }, 2000);
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto"
          onClose={() => setIsOpen(false)}
          onTransitionEnd={() => {
            if (!isOpen) {
              setFullName("");
              setBirthDate("1999-12-15");
            }
          }}
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
                    Login
                  </Dialog.Title>
                  <p className="mt-2 text-indigo-100">
                    Faça login para accessar todas as funcionalidades.
                  </p>
                  <ButtonClose
                    className="absolute right-3 top-3 w-0 h-0"
                    onClick={() => setIsOpen(false)}
                  />
                </div>

                <div className="flex-grow overflow-y-auto p-6 sm:p-8">
                  <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
                    <div>
                      <Label>Nome completo</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="Mestre dos Magos"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="max-w-lg">
                      <Label>Data de nascimento</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-calendar"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 flex justify-center border-t border-neutral-200 dark:border-neutral-700">
                  <ButtonPrimary
                    onClick={() => login()}
                    sizeClass="px-6 py-3"
                    className="bg-indigo-600 hover:bg-indigo-100 dark:bg-indigo-700 dark:hover:bg-indigo-300"
                  >
                    Entrar
                  </ButtonPrimary>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalLogin;
