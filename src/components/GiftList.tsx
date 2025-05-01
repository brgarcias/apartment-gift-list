"use client";

import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import HeaderFilterSection2 from "./HeaderFilterSection2";

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        className={`text-xs font-small px-2 py-0.5 rounded-full ${statusMap[status].color}`}
      >
        {statusMap[status].text}
      </span>
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
                className={`bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow duration-300 flex flex-col ${
                  gift.status.toLocaleLowerCase() !== GiftStatusEnum.AVAILABLE
                    ? "opacity-70"
                    : ""
                }`}
                style={{ minHeight: "450px" }} // Altura mínima para consistência
              >
                {/* Bloco 1: Imagem (altura fixa) */}
                <div className="h-48 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-4">
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
                    {getStatusBadge(gift.status)}
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
