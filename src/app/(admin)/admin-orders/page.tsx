"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArchiveBoxIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Prices from "@/components/Prices";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import NcModal from "@/shared/NcModal/NcModal";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import Badge from "@/shared/Badge/Badge";
import Image from "next/image";
import Avatar from "@/shared/Avatar/Avatar";
import { useRouter } from "next/navigation";
import ButtonThird from "@/shared/Button/ButtonThird";
import { GiftStatusEnum } from "@/enums/gift.enum";

interface User {
  id: number;
  name: string;
  birthDate: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
}

interface Gift {
  id: number;
  name: string;
  description: string;
  purchaseLink: string;
  imageUrl: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

interface OrderGift {
  giftId: number;
  orderId: number;
  gift: Gift;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number;
  user: User;
  Gift: OrderGift[];
  status?: string;
  total?: number;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_NETLIFY_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();

      // Calculate total for each order and set default status
      const ordersWithTotal = data.map((order) => ({
        ...order,
        total: order.Gift.reduce((sum, item) => sum + item.gift.price, 0),
        status: "AVAILABLE", // Default status
      }));

      setOrders(ordersWithTotal);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Erro ao carregar pedidos", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const handleDelete = (order: Order) => {
    setCurrentOrder(order);
    setIsModalDeleteOpen(true);
  };

  const handleDeleteOrder = async (giftId: number) => {
    showFeedback("Cancelando pedido", true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts/${giftId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: GiftStatusEnum.AVAILABLE,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to cancel order");
      showToast("Pedido cancelado com sucesso", "success");
    } catch (error) {
      showToast("Erro ao cancelar pedido", "error");
    } finally {
      showFeedback("", false);
      setIsModalDeleteOpen(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.status &&
        order.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const SkeletonLoader = () => (
    <div className="space-y-4">
      <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="nc-AdminOrdersPage">
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
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Gerenciar Pedidos</h2>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
                <ArchiveBoxIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">
                  Nenhum pedido encontrado
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "Nenhum resultado para sua busca"
                    : "Ainda não há pedidos registrados"}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Avatar
                                  imgUrl={order.user?.profileImage}
                                  sizeClass="w-full h-full"
                                  userName={order.user?.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                  {order.user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="text-center px-6 py-4 whitespace-nowrap">
                            <Badge
                              name={
                                !order.deletedAt ? "Finalizado" : "Cancelado"
                              }
                              className={
                                !order.deletedAt
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }
                            />
                          </td>
                          <td className="justify-items-center px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                            <Prices
                              price={order.total || 0}
                              className="text-base max-w-fit"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setCurrentOrder(order);
                                setIsModalOpen(true);
                              }}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500"
                              title="Detalhes"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              disabled={!!order.deletedAt}
                              onClick={() => handleDelete(order)}
                              className={`p-1 rounded-full ${
                                !order.deletedAt
                                  ? "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                              title="Desvincular Pedido"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalhes do pedido */}
      <NcModal
        isOpenProp={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        modalTitle={`Detalhes do Pedido #${currentOrder?.id}`}
        triggerText={false}
        contentExtraClass="max-w-3xl"
        renderContent={() =>
          currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Informações do Pedido
                  </h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">ID:</span> {currentOrder.id}
                    </p>
                    <p>
                      <span className="font-medium">Data:</span>{" "}
                      {formatDate(currentOrder.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        name={
                          !currentOrder.deletedAt ? "Finalizado" : "Cancelado"
                        }
                        className={
                          !currentOrder.deletedAt
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }
                      />
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Cliente
                  </h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <Avatar
                        imgUrl={currentOrder.user?.profileImage}
                        sizeClass="w-full h-full"
                        userName={currentOrder.user?.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {currentOrder.user.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Nascimento: {currentOrder.user.birthDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Itens do Pedido
                </h3>
                <div className="mt-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                  {currentOrder.Gift.map((item) => (
                    <div key={item.giftId} className="flex py-4">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          draggable="false"
                          fill
                          src={item.gift.imageUrl}
                          alt={item.gift.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-slate-900 dark:text-slate-100">
                            <h3>{item.gift.name}</h3>
                            <Prices price={item.gift.price} className="ml-2" />
                          </div>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.gift.description}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <ButtonThird
                            onClick={() =>
                              router.push(`/gifts/${item.gift.id}`)
                            }
                            sizeClass="py-0 px-0"
                            fontSize="font-small"
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Ver produto
                          </ButtonThird>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <ButtonPrimary
                  sizeClass="px-3 py-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Fechar
                </ButtonPrimary>
              </div>
            </div>
          )
        }
      />

      <NcModal
        isOpenProp={isModalDeleteOpen}
        onCloseModal={() => setIsModalDeleteOpen(false)}
        modalTitle={`Cancelar Pedido #${currentOrder?.id}`}
        triggerText={false}
        contentExtraClass="max-w-[450px]"
        renderContent={() =>
          currentOrder && (
            <>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tem certeza que deseja cancelar o pedido
                <Badge className="px-2 py-1 mx-1" name={currentOrder.id} /> e
                desvincular o presente
                <Badge
                  className="px-2 py-1 mx-1 bg-red-500 text-white"
                  name={currentOrder.Gift[0].gift.name}
                />{" "}
                dele ?
              </label>

              <div className="flex justify-end space-x-3 pt-4">
                <ButtonPrimary
                  sizeClass="px-3 py-1"
                  type="button"
                  onClick={() =>
                    handleDeleteOrder(currentOrder?.Gift[0].gift.id)
                  }
                >
                  Cancelar
                </ButtonPrimary>
              </div>
            </>
          )
        }
      />
    </div>
  );
};

export default AdminOrdersPage;
