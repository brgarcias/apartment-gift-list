"use client";

import React, { FC, use, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import backgroundPattern from "@/images/Moon.svg";
import imagePromo from "@/images/image-promo.webp";
import Image from "next/image";
import Modal from "./Modal/Modal";
import { useRouter } from "next/navigation";

export interface SectionPromo2Props {
  className?: string;
}

const SectionPromo2: FC<SectionPromo2Props> = ({ className = "lg:pt-10" }) => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const router = useRouter();
  return (
    <div className={`nc-SectionPromo2 ${className}`}>
      <div className="relative flex flex-col lg:flex-row justify-between bg-indigo-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            fill
            className="object-cover opacity-10 dark:opacity-5"
            src={backgroundPattern}
            alt="Padrão de fundo"
          />
        </div>

        <div className="relative lg:w-[50%] mb-10 lg:mb-0">
          <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl !leading-[1.13] tracking-tight">
            Obrigado por fazer parte <br />
            dessa nova jornada!
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Cada presente escolhido com carinho vai ajudar a transformar nosso
            apartamento em um verdadeiro lar.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <ButtonPrimary
              onClick={() => router.push("/about")}
              className="dark:bg-slate-200 dark:text-slate-900"
            >
              Sobre a Festa
            </ButtonPrimary>

            <ButtonPrimary
              onClick={() => setisOpenMoreFilter(true)}
              className="bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-indigo-800"
            >
              Como Funciona
            </ButtonPrimary>
          </div>
        </div>

        <div className="relative lg:w-[45%] flex items-center justify-center">
          <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
              <Image
                fill
                className="object-cover rounded-lg"
                src={imagePromo}
                alt="imagem promo"
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-xl font-medium text-slate-800 dark:text-white">
                Endereço para Entrega
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Av. Inajar de Souza, 3947 - Apt 501 Torre 3
                <br />
                Vila Nova Cachoeirinha, São Paulo - SP
                <br />
                CEP: 02861-160
              </p>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                * Por favor, avise quando enviar o presente
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpenMoreFilter={isOpenMoreFilter}
        setisOpenMoreFilter={setisOpenMoreFilter}
      />
    </div>
  );
};

export default SectionPromo2;
