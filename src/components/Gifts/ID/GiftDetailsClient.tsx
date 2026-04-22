"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Badge from "@/shared/Badge/Badge";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonThird from "@/shared/Button/ButtonThird";

import ModalLogin from "@/components/Modal/Login";

import { Gift } from "@/types/gifts";
import { GiftStatusEnum } from "@/enums/gift.enum";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Component
 */
export default function GiftDetailsClient({ gift }: Readonly<{ gift: Gift }>) {
  const router = useRouter();

  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [openModalLogIn, setOpenModalLogIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * send email notification to gift owner
   */
  const sendEmailNotification = async () => {
    if (!gift) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/sendgrid/notification`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: {
              name: user?.name,
              email: user?.email,
            },
            gift: gift,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error || "Falha ao enviar email", "error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao enviar email";
      console.error(errorMessage, "error");
    }
  };

  /**
   * status badge helper
   */
  const getStatusBadge = (status: GiftStatusEnum) => {
    const pulseAnimation = "animate-[pulse_1.5s_ease-in-out_infinite]";
    const bounceAnimation = "animate-[bounce_1s_ease-in-out_infinite]";
    const shakeAnimation = "hover:animate-[shake_0.5s_ease-in-out]";
    const tooltipShakeAnimation =
      "group-hover:animate-[shake_0.5s_ease-in-out]";

    const statusMap = {
      [GiftStatusEnum.AVAILABLE.toUpperCase()]: {
        text: "Disponível",
        color:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      [GiftStatusEnum.PURCHASED.toUpperCase()]: {
        text: "Comprado",
        color: "bg-blue-800 text-blue-100 dark:bg-blue-100 dark:text-blue-900",
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              className="w-4 h-4 mr-2 text-red-600 dark:text-red-600 flex-shrink-0"
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      [GiftStatusEnum.RESERVED.toUpperCase()]: {
        text: "Reservado",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        ),
      },
    };

    const purchasedByCurrentUser =
      status === GiftStatusEnum.PURCHASED.toUpperCase() &&
      gift?.GiftOnOrder?.some((order) => order.order.user.id === user?.id);

    return (
      <div className="relative inline-block group">
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full leading-4 ${
              statusMap[status].color
            } transition-all duration-300 transform hover:scale-105 ${shakeAnimation} ${
              purchasedByCurrentUser ? pulseAnimation : ""
            }`}
          >
            {statusMap[status].icon}
            {statusMap[status].text}
          </span>
        </div>

        {purchasedByCurrentUser && (
          <div
            className={`
              absolute z-20 w-full min-w-[150px] max-w-[150px] 
              bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
              rounded-lg shadow-lg p-2.5 top-full mt-2 
              opacity-100 group-hover:opacity-100 
              transition-all duration-300 
              transform hover:scale-105
              ${bounceAnimation}
            `}
            style={{
              right: "-25%",
            }}
          >
            <div className={`flex items-center ${tooltipShakeAnimation}`}>
              <svg
                className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-small text-gray-700 dark:text-gray-200">
                Você comprou este presente!
              </p>
            </div>
            <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-t border-l border-gray-100 dark:border-gray-700 transform rotate-45 -translate-x-1/2"></div>
          </div>
        )}
      </div>
    );
  };

  /**
   * memo: purchased by current user
   */
  const purchasedByCurrentUser = useMemo(() => {
    if (!user) return false;

    return gift.GiftOnOrder?.some((order) => order.order.user.id === user.id);
  }, [gift.GiftOnOrder, user]);

  /**
   * purchase handler
   */
  const handlePurchase = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch(`/api/gifts/${gift.id}/purchase`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao comprar presente");
      }

      showToast("Muito obrigado pela compra!", "success");
      sendEmailNotification();
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao comprar presente";
      showToast(errorMessage, "error");
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
      showFeedback("", false);
    }
  };

  /**
   * format date helper
   */
  const formatDate = (date: Date) =>
    format(new Date(date), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });

  /**
   * derived states
   */
  const canPurchase = gift.status.toLowerCase() === GiftStatusEnum.AVAILABLE;

  const canAccessPurchaseLink =
    gift.purchaseLink &&
    (gift.status.toLowerCase() === GiftStatusEnum.AVAILABLE ||
      (gift.status.toLowerCase() === GiftStatusEnum.PURCHASED &&
        purchasedByCurrentUser));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="space-y-6">
            {/* back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm sm:text-base"
            >
              ← Voltar para lista
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row">
                {/* image */}
                <div className="rounded-xl w-full md:w-1/2 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-6">
                  <div className="relative w-full h-72">
                    <Image
                      src={gift.imageUrl}
                      alt={gift.name}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* content */}
                <div className="w-full md:w-1/2 p-6 space-y-5">
                  {/* header */}
                  <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">{gift.name}</h1>

                    {getStatusBadge(gift.status)}
                  </div>

                  <Badge name={gift.Category.name} />

                  {/* price */}
                  <div className="text-3xl font-bold text-indigo-600">
                    {brlFormatter.format(gift.price)}
                  </div>

                  {/* purchase link */}
                  {canAccessPurchaseLink && (
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h2 className="text-sm sm:text-base font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        Onde comprar
                      </h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {gift.purchaseLink ? (
                          (() => {
                            try {
                              const url = new URL(gift.purchaseLink);
                              return (
                                <>
                                  <a
                                    href={gift.purchaseLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all flex items-center"
                                  >
                                    {url.hostname.replace("www.", "")}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 ml-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>

                                  <ButtonPrimary
                                    targetBlank
                                    href={gift.purchaseLink}
                                    className="bg-blue-600 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-gray-400 text-white text-sm sm:text-base font-medium py-2 px-3 sm:px-4 rounded transition-colors duration-200 inline-flex items-center justify-center flex-shrink-0"
                                  >
                                    Visitar Loja
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 ml-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </ButtonPrimary>
                                </>
                              );
                            } catch {
                              return <span>{gift.purchaseLink}</span>;
                            }
                          })()
                        ) : (
                          <span>Sem link de compra</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* description */}
                  <p className="text-gray-600 dark:text-gray-300">
                    {gift.description?.trim() ||
                      "Este presente não possui descrição detalhada."}
                  </p>

                  {/* dates */}
                  <div className="grid grid-cols-2 text-sm">
                    <div>
                      <p className="text-gray-500">Adicionado em</p>

                      {formatDate(gift.createdAt)}
                    </div>

                    <div>
                      <p className="text-gray-500">Atualizado em</p>

                      {formatDate(gift.updatedAt)}
                    </div>
                  </div>

                  {/* purchase button */}
                  <div>
                    {canPurchase ? (
                      showConfirmation ? (
                        <div className="space-y-3">
                          Confirmar compra?
                          <div className="grid grid-cols-2 gap-3">
                            <ButtonPrimary
                              disabled={isProcessing}
                              onClick={handlePurchase}
                            >
                              Confirmar
                            </ButtonPrimary>

                            <ButtonThird
                              disabled={isProcessing}
                              onClick={() => setShowConfirmation(false)}
                            >
                              Cancelar
                            </ButtonThird>
                          </div>
                        </div>
                      ) : (
                        <ButtonPrimary
                          className="w-full"
                          onClick={() => {
                            if (!isLoggedIn) return setOpenModalLogIn(true);

                            setShowConfirmation(true);
                          }}
                        >
                          Comprar presente
                        </ButtonPrimary>
                      )
                    ) : (
                      <ButtonPrimary disabled className="w-full">
                        Presente indisponível
                      </ButtonPrimary>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ModalLogin isOpen={openModalLogIn} setIsOpen={setOpenModalLogIn} />
    </div>
  );
}
