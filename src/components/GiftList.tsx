"use client";

import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import HeaderFilterSection2 from "./HeaderFilterSection2";
import { useAuth } from "@/contexts/AuthContext";

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const fetchAvailableGifts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts`);
      if (!res.ok) throw new Error("Falha ao carregar presentes");
      const data = await res.json();
      setGifts(data);
      setFilteredGifts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...gifts];

    // Filtro por nome
    if (searchTerm) {
      result = result.filter((gift) =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por range de preço
    result = result.filter(
      (gift) => gift.price >= priceRange[0] && gift.price <= priceRange[1]
    );

    // Filtro por categoria
    if (selectedCategories.length > 0) {
      result = result.filter((gift) =>
        selectedCategories.includes(gift.Category?.name || "")
      );
    }

    // Filtro por disponibilidade
    if (onlyAvailable) {
      result = result.filter(
        (gift) => gift.status.toLocaleLowerCase() === GiftStatusEnum.AVAILABLE
      );
    }

    // Ordenação
    switch (sortOrder) {
      case "Price-low-hight":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price-hight-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "A-Z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredGifts(result);
  }, [
    gifts,
    searchTerm,
    priceRange,
    selectedCategories,
    sortOrder,
    onlyAvailable,
  ]);

  useEffect(() => {
    fetchAvailableGifts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    priceRange,
    selectedCategories,
    sortOrder,
    onlyAvailable,
    gifts,
    applyFilters,
  ]);

  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatPrice = (price: number) => {
    return brlFormatter.format(price);
  };

  const getStatusBadge = (gift: Gift) => {
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
      gift.status === GiftStatusEnum.PURCHASED.toUpperCase() &&
      gift?.GiftOnOrder?.some((order) => order.order.user.id === user?.id);

    return (
      <div className="relative inline-block group">
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full leading-4 ${
              statusMap[gift.status].color
            } transition-all duration-300 transform hover:scale-105 ${shakeAnimation} ${
              purchasedByCurrentUser ? pulseAnimation : ""
            }`}
          >
            {statusMap[gift.status].icon}
            {statusMap[gift.status].text}
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

  const clearAllFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSortOrder("");
    setOnlyAvailable(false);
  };

  const GiftCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 p-6 animate-pulse flex flex-col space-y-4">
      <div className="h-48 bg-gray-200 dark:bg-slate-600 rounded" />
      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/3" />
      <div className="space-y-2 mt-auto">
        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2" />
        <div className="h-10 bg-gray-300 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );

  return (
    <div id="gifts" className="max-w-6xl mx-auto p-6">
      <HeaderFilterSection2
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        clearAllFilters={clearAllFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GiftCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : filteredGifts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Nenhum presente encontrado com os filtros aplicados.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGifts.map((gift) => (
              <div
                key={gift.id}
                className={`bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow duration-300 flex flex-col ${
                  gift.status.toLocaleLowerCase() !== GiftStatusEnum.AVAILABLE
                    ? "opacity-70"
                    : ""
                }`}
                style={{ minHeight: "450px" }} // Altura mínima para consistência
              >
                {/* Bloco 1: Imagem (altura fixa) */}
                <div className="rounded-t-lg h-48 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-4">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    width={200}
                    height={200}
                    className="object-contain h-full w-full"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>

                {/* Bloco 2: Conteúdo (flexível) */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                      {gift.name}
                    </h2>
                    {getStatusBadge(gift)}
                  </div>

                  {gift.Category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {gift.Category.name}
                    </p>
                  )}

                  <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 my-2">
                    {formatPrice(gift.price)}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <p>
                      Adicionado em:{" "}
                      {new Date(gift.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      Atualizado em:{" "}
                      {new Date(gift.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Bloco 3: Footer (altura fixa) */}
                <div className="p-6 pt-0">
                  <ButtonPrimary
                    onClick={() => router.push(`/gifts/${gift.id}`)}
                    sizeClass="px-4 py-2 w-full"
                    fontSize="text-sm sm:text-base font-medium"
                    className="transition-colors duration-300"
                  >
                    Ver detalhes
                  </ButtonPrimary>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
