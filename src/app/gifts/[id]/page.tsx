"use client";

import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonThird from "@/shared/Button/ButtonThird";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function GiftDetails({ params }: { params: { id: string } }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const fetchGiftDetails = async (id: string) => {
    try {
      setIsLoading(true);
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
    if (!gift) return;

    try {
      setIsLoading(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts/${gift.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: GiftStatusEnum.PURCHASED }),
        }
      );
      router.push("/home-2");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao comprar presente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchGiftDetails(params.id);
    }
  }, [params.id]);

  const getStatusBadge = (status: GiftStatusEnum) => {
    const statusMap = {
      [GiftStatusEnum.AVAILABLE.toUpperCase()]: {
        text: "Disponível",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      [GiftStatusEnum.PURCHASED.toUpperCase()]: {
        text: "Comprado",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      },
      [GiftStatusEnum.RESERVED.toUpperCase()]: {
        text: "Reservado",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusMap[status].color}`}
      >
        {statusMap[status].text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push("/home-2")}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Presente não encontrado
        </p>
        <button
          onClick={() => router.push("/home-2")}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => router.push("/home-2")}
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

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-8">
            <Image
              src={gift.imageUrl}
              alt={gift.name}
              width={320}
              height={320}
              className="object-contain max-h-full"
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {gift.name}
              </h1>
              {getStatusBadge(gift.status)}
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
                  {new URL(gift.purchaseLink).hostname.replace("www.", "")}
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
                {gift.description ||
                  "Este presente não possui descrição detalhada."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Adicionado em
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(gift.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Atualizado em
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(gift.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {gift.status === GiftStatusEnum.AVAILABLE.toUpperCase() ? (
              showConfirmation ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Confirmar compra deste presente?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <ButtonThird
                      onClick={handlePurchase}
                      sizeClass="px-1 py-1 lg:px-1 lg:py-3"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-3 px-6 transition-colors duration-300"
                    >
                      Confirmar
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={() => setShowConfirmation(false)}
                      sizeClass="px-1 py-1 lg:px-1 lg:py-3"
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium py-3 px-6 transition-colors duration-300"
                    >
                      Cancelar
                    </ButtonPrimary>
                  </div>
                </div>
              ) : (
                <ButtonPrimary
                  onClick={() => setShowConfirmation(true)}
                  sizeClass="px-2 py-2 lg:px-6 lg:py-3"
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium py-3 px-6 transition-colors duration-300"
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
    </div>
  );
}
