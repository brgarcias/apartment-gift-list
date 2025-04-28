import React, { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import backgroundPattern from "@/images/Moon.svg";
import imageAp from "@/images/ap.jpg";
import Image from "next/image";

export interface SectionPromo2Props {
  className?: string;
}

const SectionPromo2: FC<SectionPromo2Props> = ({ className = "lg:pt-10" }) => {
  return (
    <div className={`nc-SectionPromo2 ${className}`}>
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between bg-indigo-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 sm:p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            fill
            className="object-cover opacity-10 dark:opacity-5"
            src={backgroundPattern}
            alt="Padrão de fundo"
            priority
          />
        </div>

        <div className="relative lg:w-[50%] mb-6 lg:mb-0 lg:pr-4 z-10">
          <span className="block text-sm sm:text-md md:text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            Estamos começando uma nova jornada! 🏡
          </span>
          <h2 className="font-bold text-black dark:text-white text-2xl sm:text-3xl md:text-4xl xl:text-5xl !leading-[115%] mb-4">
            Ajude-nos a mobiliar nosso lar
          </h2>
          <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 mb-6">
            Cada presente será um pedacinho da nossa história juntos
          </p>

          <ButtonPrimary
            className="mt-2 sm:mt-4"
            href="#gifts"
            sizeClass="px-5 py-2.5 lg:px-6 lg:py-3"
            fontSize="text-sm sm:text-md lg:text-lg font-medium"
          >
            Como Funciona
          </ButtonPrimary>
        </div>

        <div className="relative lg:w-[45%] flex items-center justify-center z-10">
          <div className="bg-white dark:bg-slate-700 p-3 sm:p-4 rounded-xl shadow-lg w-full max-w-md aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[450px] overflow-hidden">
            <Image
              fill
              className="w-full h-full object-cover rounded-lg"
              src={imageAp}
              alt="Nosso apartamento"
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPromo2;
