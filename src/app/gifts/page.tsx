"use client";

import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const router = useRouter();

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

    if (searchTerm) {
      result = result.filter((gift) =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter) {
      result = result.filter((gift) => gift.price <= priceFilter);
    }

    setFilteredGifts(result);
  }, [gifts, searchTerm, priceFilter]);

  useEffect(() => {
    fetchAvailableGifts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, priceFilter, gifts, applyFilters]);

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
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusMap[status].color}`}
      >
        {statusMap[status].text}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-8">
        Lista de Presentes
      </h1>
      <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md dark:shadow-slate-700/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Buscar presente
            </label>
            <input
              type="text"
              id="search"
              placeholder="Digite o nome do presente"
              className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filtrar por preço máximo
            </label>
            <div className="flex items-center">
              <span className="mr-2 dark:text-gray-300">R$</span>
              <input
                type="number"
                id="price"
                placeholder="Valor máximo"
                className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-700 dark:text-white"
                value={priceFilter || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceFilter(value ? parseFloat(value) : null);
                }}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setPriceFilter(null);
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className={`bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-700/30 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow duration-300 ${
                gift.status !== GiftStatusEnum.AVAILABLE ? "opacity-70" : ""
              }`}
            >
              <div className="h-48 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center">
                <Image
                  src={gift.imageUrl}
                  alt={gift.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {gift.name}
                  </h2>
                  {getStatusBadge(gift.status)}
                </div>

                <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-4">
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

                {gift.status === GiftStatusEnum.AVAILABLE.toUpperCase() ? (
                  <button
                    onClick={() => router.push(`/gifts/${gift.id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                  >
                    Ver detalhes
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-medium py-2 px-4 rounded cursor-not-allowed"
                  >
                    Indisponível
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
