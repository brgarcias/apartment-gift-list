import { SocialType } from "@/shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import instagram from "@/images/socials/instagram.svg";
import whatsapp from "@/images/socials/whatsapp.svg";
import youtube from "@/images/socials/youtube.svg";
import Image from "next/image";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Whatsapp", icon: whatsapp, href: "#" },
  { name: "Instagram", icon: instagram, href: "#" },
  { name: "Youtube", icon: youtube, href: "#" },
  // { name: "Twitter", icon: twitter, href: "#" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <div className="flex-shrink-0 w-5 ">
          <Image sizes="40px" src={item.icon} alt="" />
        </div>
        <span className="hidden lg:block text-sm">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
