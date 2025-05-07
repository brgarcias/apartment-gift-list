import React from "react";
import logoImg from "@/images/logo.png";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight, // Removemos o valor padrão pois vamos usar CSS
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {img ? (
        <>
          <Image
            draggable="false"
            className={`block h-12 sm:h-10 w-auto dark:hidden`}
            src={img}
            alt="Logo"
            sizes="200px"
            priority
          />

          <Image
            draggable="false"
            className={`hidden dark:block h-12 sm:h-10 w-auto filter invert brightness-0 dark:brightness-100`}
            src={img}
            alt="Logo"
            sizes="200px"
            priority
          />
        </>
      ) : (
        "Logo Here"
      )}
    </Link>
  );
};

export default Logo;
