import React, { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import backgroundLineSvg from "@/images/Moon.svg";
import imageAp from "@/images/ap.jpg";
import Image from "next/image";

export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero3 relative ${className} transition-colors duration-300`}
    >
      <div className="relative pt-8 lg:pt-0 lg:absolute z-10 inset-x-0 top-[10%] sm:top-[20%] container">
        <div className="flex flex-col items-start max-w-lg xl:max-w-2xl space-y-5 xl:space-y-8">
          <span className="sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-200">
            Estamos começando uma nova jornada! 🏡
          </span>
          <h2 className="font-bold text-black dark:text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl !leading-[115%]">
            Ajude-nos a mobiliar nosso lar
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Cada presente será um pedacinho da nossa história juntos
          </p>
          <div className="sm:pt-4">
            <ButtonPrimary
              href="#gifts"
              sizeClass="px-6 py-3 lg:px-8 lg:py-4"
              fontSize="text-sm sm:text-base lg:text-lg font-medium"
            >
              Ver Lista de Presentes
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <div className="relative z-[1] lg:aspect-w-16 lg:aspect-h-8">
        <div className="mt-5 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-xl lg:max-w-2xl ml-auto">
          <div className="w-full h-full rounded-lg flex items-center justify-center">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute w-full h-full object-cover rounded-lg scale-90 dark:opacity-90 dark:brightness-90"
              src={imageAp}
              alt="apartamento"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[#F7F0EA] dark:bg-slate-800 rounded-2xl overflow-hidden z-0">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute w-full h-full object-cover dark:opacity-10"
          src={backgroundLineSvg}
          alt="background"
        />
      </div>
    </div>
  );
};

export default SectionHero3;
