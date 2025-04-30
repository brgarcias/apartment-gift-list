"use client";

import React, { FC, Fragment, useRef, useState } from "react";
import { Transition } from "@headlessui/react";

export interface ModalProps {
  isOpen: boolean;
  text: string;
}

const ModalFeedback: FC<ModalProps> = ({ isOpen, text }) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-lg font-medium">{text}...</p>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default ModalFeedback;
