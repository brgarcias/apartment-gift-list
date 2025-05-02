"use client";

import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonThird from "@/shared/Button/ButtonThird";
import { useAuth } from "@/contexts/AuthContext";
import ModalLogin from "@/components/Modal/Login";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/shared/Badge/Badge";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-6 h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>

    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skeleton para a imagem */}
        <div className="h-96 bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>

        {/* Skeleton para o conteúdo */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
          </div>

          <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>

          {/* Skeleton para "Onde comprar" */}
          <div className="space-y-4">
            <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>

          {/* Skeleton para descrição */}
          <div className="space-y-3">
            <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>

          {/* Skeleton para datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton para botão */}
          <div className="h-12 w-64 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function GiftDetails({ params }: { params: { id: string } }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [openModalLogIn, setOpenModalLogIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  const fetchGiftDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts/${id}`
      );
      if (!res.ok) throw new Error("Falha ao carregar detalhes do presente");
      const data = await res.json();
      setGift(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!gift || isProcessing) return;

    setIsProcessing(true);
    showFeedback("Processando compra", true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts/${gift.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: GiftStatusEnum.PURCHASED,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao comprar presente");
      }

      showToast("Muito obrigado pela compra!", "success");
      await fetchGiftDetails(params.id);
      setShowConfirmation(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao comprar presente";
      showToast(errorMessage, "error");
    } finally {
      setIsProcessing(false);
      showFeedback("", false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchGiftDetails(params.id);
    }
  }, [params.id]);

  const getStatusBadge = (status: GiftStatusEnum) => {
    const pulseAnimation = "animate-[pulse_1.5s_ease-in-out_infinite]";
    const bounceAnimation = "animate-[bounce_1s_ease-in-out_infinite]";
    const shakeAnimation = "hover:animate-[shake_0.5s_ease-in-out]";

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
              absolute z-20 w-full min-w-[180px] max-w-[340px] 
              bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
              rounded-lg shadow-lg p-3 top-full mt-2 
              opacity-100 group-hover:opacity-100 
              transition-all duration-300 pointer-events-none 
              ${bounceAnimation}
            `}
            style={{
              right: "-38%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center">
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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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
            {gift && (
              <>
                <button
                  onClick={() => router.push("/")}
                  className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voltar para a lista
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-96 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-8">
                      <Image
                        src={gift.imageUrl}
                        alt={gift.name}
                        width={320}
                        height={320}
                        className="object-contain max-h-full"
                        priority
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {gift.name}
                        </h1>
                        {getStatusBadge(gift.status as GiftStatusEnum)}
                      </div>
                      <div className="mb-6">
                        <Badge
                          className="font-small"
                          name={gift.Category.name}
                        />
                      </div>

                      <div className="mb-6">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {brlFormatter.format(gift.price)}
                        </p>
                      </div>
                      {gift.purchaseLink && (
                        <div className="mb-6 bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                            Onde comprar
                          </h2>
                          <a
                            href={gift.purchaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                          >
                            {new URL(gift.purchaseLink).hostname.replace(
                              "www.",
                              ""
                            )}
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
                          <div className="mt-3">
                            <a
                              href={gift.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300 inline-flex items-center"
                            >
                              Visitar loja
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
                          </div>
                        </div>
                      )}

                      <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Descrição
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          {gift.description.trim() ||
                            "Este presente não possui descrição detalhada."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Adicionado em
                          </h3>
                          <p className="text-gray-800 dark:text-gray-200">
                            {new Date(gift.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Atualizado em
                          </h3>
                          <p className="text-gray-800 dark:text-gray-200">
                            {new Date(gift.updatedAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {gift.status ===
                      GiftStatusEnum.AVAILABLE.toUpperCase() ? (
                        showConfirmation ? (
                          <div className="space-y-4">
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                              Confirmar compra deste presente?
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <ButtonThird
                                onClick={handlePurchase}
                                disabled={isProcessing}
                                sizeClass="px-1 py-1 lg:px-1 lg:py-3"
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-3 px-6 transition-colors duration-300"
                              >
                                {isProcessing ? "Processando..." : "Confirmar"}
                              </ButtonThird>
                              <ButtonPrimary
                                onClick={() => setShowConfirmation(false)}
                                disabled={isProcessing}
                                sizeClass="px-1 py-1 lg:px-1 lg:py-3"
                                className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium py-3 px-6 transition-colors duration-300"
                              >
                                Cancelar
                              </ButtonPrimary>
                            </div>
                          </div>
                        ) : (
                          <ButtonPrimary
                            onClick={() => {
                              if (!isLoggedIn) {
                                setOpenModalLogIn(true);
                                return;
                              }
                              setShowConfirmation(true);
                            }}
                            sizeClass="px-2 py-2 lg:px-6 lg:py-3"
                            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-3 px-6 transition-colors duration-300"
                          >
                            Comprar este presente
                          </ButtonPrimary>
                        )
                      ) : (
                        <ButtonPrimary
                          disabled
                          sizeClass="px-2 py-2 lg:px-8 lg:py-4"
                          className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium py-3 px-6 transition-colors duration-300"
                        >
                          Presente indisponível
                        </ButtonPrimary>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ModalLogin isOpen={openModalLogIn} setIsOpen={setOpenModalLogIn} />
    </div>
  );
}
