"use client";

import Prices from "@/components/Prices";
import { useAuth } from "@/contexts/AuthContext";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { Order } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const AccountOrder = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByUserId = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/orders/user/${user?.id}`
      );
      if (!res.ok) throw new Error("Falha ao carregar pedidos");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderProductItem = (gift: any, index: number) => {
    const { imageUrl, name, description, price, Category, purchaseLink } = gift;
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            sizes="80px"
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-3 flex flex-1 flex-col min-w-0">
          <div>
            <div className="flex justify-between">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-medium line-clamp-1 break-words">
                  {name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {description}
                </p>
                <span className="mt-1 inline-block text-xs bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full max-w-[10rem] truncate whitespace-nowrap">
                  {Category.name}
                </span>
              </div>
              <Prices
                price={price}
                className="mt-0.5 ml-2 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-xs sm:text-sm mt-2">
            <a
              href={`/gifts/${gift.id}`}
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-primary-500 hover:text-indigo-800"
            >
              Ver produto
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = (order: any, index: number) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-base sm:text-lg font-semibold">
              Pedido #{order.id}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span>{formatDate(order.createdAt)}</span>
              <span className="mx-1 sm:mx-2">·</span>
              <span className="text-green-600">Compra confirmada</span>
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4 divide-y divide-slate-200 dark:divide-slate-700">
          {order.Gift.map((giftItem: any) =>
            renderProductItem(giftItem.gift, giftItem.giftId)
          )}
        </div>
      </motion.div>
    );
  };

  const SkeletonLoader = () => (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>

      {[1, 2].map((item) => (
        <div
          key={item}
          className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-500/5">
            <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="mt-2 flex space-x-2">
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
              <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {[1, 2].map((product) => (
              <div key={product} className="flex">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
                <div className="ml-3 flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (!user) return;
    fetchOrdersByUserId();
  }, [fetchOrdersByUserId, user]);

  return (
    <div className="nc-AccountOrder">
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
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Ocorreu um erro: {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              Nenhum pedido encontrado
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Você ainda não realizou nenhuma compra em nossa lista de
              presentes.
            </p>
          </div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold">Meus Pedidos</h2>
            {orders.map((order, index) => renderOrder(order, index))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountOrder;
