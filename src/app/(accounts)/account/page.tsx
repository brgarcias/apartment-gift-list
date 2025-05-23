"use client";

import Label from "@/components/Label/Label";
import React, { useState, useEffect, useRef } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import InitialsAvatar from "@/components/Avatar/Avatar";

const AccountPage = () => {
  const { login, user } = useAuth();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user?.name || "");
      setBirthDate(formatDateForInput(user?.birthDate) || "");
      setProfileImage(user?.profileImage || "");
      setEmail(user?.email || "");
      setIsLoading(false);
    }
  }, [user]);

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

  const updateAccount = () => {
    showFeedback("Atualizando", true);
    if (!fullName || !birthDate || !email) {
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
          `${process.env.NEXT_PUBLIC_NETLIFY_URL}/users/update/${user?.id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: fullName,
              email,
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
          login(userData);
          showToast("Tudo certo. Atualizado meu camarada!", "success");
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

  const SkeletonLoader = () => (
    <div className="space-y-10 sm:space-y-12 w-full">
      <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
        </div>

        <div className="flex-grow space-y-6">
          <div>
            <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
            <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>

          <div className="max-w-lg">
            <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
            <div className="flex">
              <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-l-2xl animate-pulse"></div>
              <div className="h-12 flex-grow bg-neutral-200 dark:bg-neutral-700 rounded-r-2xl animate-pulse"></div>
            </div>
          </div>

          <div className="pt-2">
            <div className="h-12 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`nc-AccountPage `}>
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
            className="space-y-10 sm:space-y-12"
          >
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Informações da conta
            </h2>
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex items-start">
                {/* AVATAR */}
                <div className="relative rounded-full overflow-hidden flex">
                  {profileImage ? (
                    <Image
                      draggable="false"
                      src={profileImage}
                      alt="avatar"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover z-0"
                    />
                  ) : (
                    <InitialsAvatar name={fullName} size={128} />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-1 text-xs">Trocar Imagem</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                <div className="max-w-lg">
                  <Label>Nome completo</Label>
                  <Input
                    className="mt-1.5"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="max-w-lg">
                  <Label>E-mail</Label>
                  <Input
                    className="mt-1.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* ---- */}
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
                <div className="pt-2">
                  <ButtonPrimary onClick={updateAccount}>
                    Atualizar conta
                  </ButtonPrimary>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountPage;
