"use client";

import { Popover, Transition } from "@/app/headlessui";
import { avatarImgs } from "@/contains/fakeData";
import { Fragment, use, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import Link from "next/link";
import Modal from "../Modal/Modal";
import ModalLogin from "../Modal/Login";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function AvatarDropdown() {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [openModalLogIn, setOpenModalLogIn] = useState(false);
  const { isLoggedIn, user, login, logout: authLogout } = useAuth();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(true);

  const logout = async (close: any): Promise<void> => {
    showFeedback("Saindo", true);
    setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NETLIFY_URL}/auth/signout`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error logging out");
        authLogout();
        close();
        showToast("Até logo camarada!", "success");
      } catch (error) {
        console.error("Logout error:", error);
        showToast(
          "Opa, algo deu errado amigo. Tente de novo aí por favor.",
          "error"
        );
      } finally {
        showFeedback("", false);
      }
    }, 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showFeedback("Enviando imagem", true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/drive/upload/${user?.id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (updateRes.ok) {
        const userData = await updateRes.json();
        login(JSON.parse(userData.updatedUser.body));
        showToast("Imagem de perfil atualizada com sucesso!", "success");
      } else {
        throw new Error("Falha ao atualizar imagem no banco de dados");
      }
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      showToast("Erro ao enviar imagem. Tente novamente.", "error");
    } finally {
      showFeedback("", false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const SkeletonLoader = () => (
    <div className="AvatarDropdown">
      <div className="relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="AvatarDropdown">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
                  >
                    <svg
                      className=" w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 right-0 sm:right-0 sm:px-0">
                      <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                        {isLoggedIn ? (
                          <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                            {/* ------------------ FOTO E NOME --------------------- */}
                            <div className="flex items-center space-x-3 cursor-pointer">
                              <div className="relative">
                                {/* Avatar */}
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                  <Avatar
                                    imgUrl={user?.profileImage}
                                    sizeClass="w-full h-full"
                                    userName={user?.name}
                                  />

                                  {/* Overlay para troca de imagem - arredondado */}
                                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>

                                    {/* Input file escondido */}
                                    <input
                                      type="file"
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex-grow">
                                <h4 className="font-semibold">{user?.name}</h4>
                                <p className="text-xs mt-0.5">São Paulo, SP</p>
                              </div>
                            </div>
                            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                            {/* ------------------ MINHA CONTA --------------------- */}
                            <Link
                              href={"/account"}
                              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              onClick={() => close()}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium ">
                                  {"Minha Conta"}
                                </p>
                              </div>
                            </Link>
                            {/* ------------------ MEUS PEDIDOS --------------------- */}
                            <Link
                              href={"/account-order"}
                              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              onClick={() => close()}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M8 12.2H15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 16.2H12.38"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium ">
                                  {"Meus Pedidos"}
                                </p>
                              </div>
                            </Link>
                            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                            {/* ------------------ HELP --------------------- */}
                            <Link
                              href={"#"}
                              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              onClick={() => setisOpenMoreFilter(true)}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44715 2 1.97 6.47715 1.97 12C1.97 17.5228 6.44715 22 11.97 22Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M4.89999 4.92993L8.43999 8.45993"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M4.89999 19.07L8.43999 15.54"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M19.05 19.07L15.51 15.54"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M19.05 4.92993L15.51 8.45993"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium ">
                                  {"Ajuda"}
                                </p>
                              </div>
                            </Link>
                            {/* ------------------ LOG OUT --------------------- */}
                            <Link
                              href={"#"}
                              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              onClick={() => logout(close)}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15 12H3.62"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium ">
                                  {"Log out"}
                                </p>
                              </div>
                            </Link>
                          </div>
                        ) : (
                          <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                            <Link
                              href={"#"}
                              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              onClick={() => setOpenModalLogIn(true)}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15 12H3.62"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium ">
                                  {"Entrar"}
                                </p>
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpenMoreFilter={isOpenMoreFilter}
        setisOpenMoreFilter={setisOpenMoreFilter}
      />
      <ModalLogin isOpen={openModalLogIn} setIsOpen={setOpenModalLogIn} />
    </div>
  );
}
