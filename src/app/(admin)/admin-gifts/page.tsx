"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift } from "@/types/gifts";
import Textarea from "@/shared/Textarea/Textarea";
import Select from "@/shared/Select/Select";
import { Category } from "@prisma/client";
import NcModal from "@/shared/NcModal/NcModal";
import Badge from "@/shared/Badge/Badge";

const AdminGiftsPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  // Estados para listagem
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  // Estados para o modal de cadastro/edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Partial<Gift> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Formatação de preço
  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatPrice = (price: number) => {
    return brlFormatter.format(price);
  };

  // Buscar presentes
  const fetchGifts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_NETLIFY_URL}/gifts`);
      if (!res.ok) throw new Error("Falha ao carregar presentes");
      const data = await res.json();
      setGifts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/categories`
      );
      if (!res.ok) throw new Error("Falha ao carregar categorias");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  useEffect(() => {
    fetchGifts();
    fetchCategories();
  }, []);

  // Filtro de busca
  const filteredGifts = gifts.filter((gift) =>
    gift.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipuladores de modal
  const openCreateModal = () => {
    setCurrentGift({
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      status: GiftStatusEnum.AVAILABLE,
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (gift: Gift) => {
    setCurrentGift(gift);
    setImagePreview(gift.imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGift(null);
  };

  // Upload de imagem (simulado)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);

      // Simular upload
      setTimeout(() => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setCurrentGift((prev) => ({
            ...prev,
            imageUrl: URL.createObjectURL(file),
          }));
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  // Salvar presente
  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGift) return;

    showFeedback("Salvando presente", true);
    const isNew = !currentGift.id;

    try {
      // Simular chamada à API
      setTimeout(() => {
        if (isNew) {
          // Adicionar novo presente
          const newGift = {
            ...currentGift,
          };
          setGifts((prev) => [...prev, newGift as Gift]);
          showToast("Presente criado com sucesso!", "success");
        } else {
          // Atualizar presente existente
          setGifts((prev) =>
            prev.map((gift) =>
              gift.id === currentGift.id ? { ...gift, ...currentGift } : gift
            )
          );
          showToast("Presente atualizado com sucesso!", "success");
        }
        closeModal();
        showFeedback("", false);
      }, 1500);
    } catch (err) {
      showToast("Erro ao salvar presente", "error");
      showFeedback("", false);
    }
  };

  const handleDelete = (gift: Gift) => {
    setCurrentGift(gift);
    setIsModalDeleteOpen(true);
  };

  // Excluir presente
  const handleDeleteGift = async (id: number | undefined) => {
    showFeedback("Excluindo presente", true);

    setTimeout(() => {
      try {
        // Simular chamada à API
        setGifts((prev) => prev.filter((gift) => gift.id !== id));
        showToast("Presente excluído com sucesso!", "success");
        showFeedback("", false);
      } catch (err) {
        showToast("Erro ao excluir presente", "error");
        showFeedback("", false);
      } finally {
        setIsModalDeleteOpen(false);
      }
    }, 2000);
  };

  // Esqueleto de carregamento
  const GiftRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-24"></div>
      </td>
    </tr>
  );

  return (
    <div className="nc-AdminGiftsPage">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold">Gerenciamento de Presentes</h2>

        {/* Barra de busca */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              placeholder="Buscar presentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mr-2"
            />
            <ButtonPrimary
              fontSize="sm:font-small"
              sizeClass="px-3 py-2"
              onClick={openCreateModal}
            >
              Adicionar
            </ButtonPrimary>
          </div>
        </div>

        {/* Tabela de presentes */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {Array.from({ length: 5 }).map((_, i) => (
                  <GiftRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          ) : error ? (
            <div className="p-6 text-red-500 dark:text-red-400">{error}</div>
          ) : filteredGifts.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Nenhum presente encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredGifts.map((gift) => (
                    <tr
                      key={gift.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4 max-w-[300px] overflow-hidden">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={gift.imageUrl}
                              alt={gift.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {gift.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {gift.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {gift.Category?.name || "Sem categoria"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatPrice(gift.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            gift.status.toLocaleLowerCase() ===
                            GiftStatusEnum.AVAILABLE
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : gift.status.toLocaleLowerCase() ===
                                GiftStatusEnum.RESERVED
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {gift.status.toLocaleLowerCase() ===
                          GiftStatusEnum.AVAILABLE
                            ? "Disponível"
                            : gift.status.toLocaleLowerCase() ===
                              GiftStatusEnum.RESERVED
                            ? "Reservado"
                            : "Comprado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => openEditModal(gift)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(gift)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de cadastro/edição */}
        <AnimatePresence>
          <NcModal
            isOpenProp={isModalOpen}
            onCloseModal={closeModal}
            modalTitle={
              currentGift?.id ? "Editar Presente" : "Adicionar Presente"
            }
            triggerText={false}
            contentExtraClass="max-w-3xl"
            renderContent={() =>
              currentGift && (
                <form onSubmit={handleSaveGift} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nome do Presente*
                    </label>
                    <Input
                      value={currentGift.name || ""}
                      onChange={(e) =>
                        setCurrentGift({
                          ...currentGift,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      value={currentGift.description || ""}
                      onChange={(e) =>
                        setCurrentGift({
                          ...currentGift,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Preço*
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentGift.price || 0}
                        onChange={(e) =>
                          setCurrentGift({
                            ...currentGift,
                            price: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Status*
                      </label>
                      <Select
                        value={currentGift.status || GiftStatusEnum.AVAILABLE}
                        onChange={(e) =>
                          setCurrentGift({
                            ...currentGift,
                            status: e.target.value as GiftStatusEnum,
                          })
                        }
                        required
                      >
                        <option value={GiftStatusEnum.AVAILABLE}>
                          Disponível
                        </option>
                        <option value={GiftStatusEnum.RESERVED}>
                          Reservado
                        </option>
                        <option value={GiftStatusEnum.PURCHASED}>
                          Comprado
                        </option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Categoria
                    </label>
                    <Select
                      value={currentGift.categoryId || ""}
                      onChange={(e) =>
                        setCurrentGift({
                          ...currentGift,
                          categoryId: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Imagem
                    </label>
                    <div className="flex items-center space-x-4">
                      {imagePreview && (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden border border-gray-200 dark:border-slate-700">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="imageUpload"
                          className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isUploading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          {isUploading ? "Enviando..." : "Selecionar Imagem"}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <ButtonPrimary sizeClass="px-3 py-2" type="submit">
                      {currentGift.id ? "Atualizar" : "Salvar"}
                    </ButtonPrimary>
                  </div>
                </form>
              )
            }
          />

          <NcModal
            isOpenProp={isModalDeleteOpen}
            onCloseModal={() => setIsModalDeleteOpen(false)}
            modalTitle="Deletar Presente"
            triggerText={false}
            contentExtraClass="max-w-[450px]"
            renderContent={() =>
              currentGift && (
                <>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tem certeza que deseja excluir o presente{" "}
                    <Badge
                      className="bg-red-500 text-white"
                      name={currentGift.name}
                    />{" "}
                    ?
                  </label>

                  <div className="flex justify-end space-x-3 pt-4">
                    <ButtonPrimary
                      sizeClass="px-3 py-1"
                      type="button"
                      onClick={() => handleDeleteGift(currentGift.id)}
                    >
                      Deletar
                    </ButtonPrimary>
                  </div>
                </>
              )
            }
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminGiftsPage;
