import { avatarColors } from "@/contains/contants";
import React, { FC } from "react";
import { avatarImgs } from "@/contains/fakeData";
import VerifyIcon from "@/components/VerifyIcon";
import Image, { StaticImageData } from "next/image";
import InitialsAvatar from "@/components/Avatar/Avatar";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string | StaticImageData | undefined | null;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl,
  userName,
  hasChecked,
  hasCheckedClass = "w-4 h-4 bottom-1 -right-0.5",
}) => {
  const url = imgUrl || "";
  const name = userName || "John Doe";
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(
      name.charCodeAt(0) % avatarColors.length
    );
    return avatarColors[backgroundIndex];
  };

  return (
    <div
      className={`wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
    >
      {url ? (
        <Image
          draggable="false"
          fill
          sizes="100px"
          className={`absolute inset-0 w-full h-full object-cover ${radius}`}
          src={url}
          alt={name}
        />
      ) : (
        <InitialsAvatar name={name} size={40} />
      )}

      {hasChecked && (
        <span className={`  text-white  absolute  ${hasCheckedClass}`}>
          <VerifyIcon className="" />
        </span>
      )}
    </div>
  );
};

export default Avatar;
