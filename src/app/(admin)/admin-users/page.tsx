"use client";

import { User } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import NcModal from "@/shared/NcModal/NcModal";
import Checkbox from "@/shared/Checkbox/Checkbox";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/shared/Avatar/Avatar";
import Badge from "@/shared/Badge/Badge";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const { login, user: authUser } = useAuth();
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_NETLIFY_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const formattedUsers = data.map((user: User) => ({
        ...user,
        birthDate: formatDateForInput(user.birthDate),
      }));
      setUsers(formattedUsers);
    } catch (error) {
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setCurrentUser(user);
    setIsModalDeleteOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    showFeedback("Excluindo usuário", true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/users/delete/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      showToast("Usuário excluído com sucesso", "success");
    } catch (error) {
      showToast("Erro ao excluir usuário", "error");
    } finally {
      showFeedback("", false);
      setIsModalDeleteOpen(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    showFeedback("Salvando alterações", true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/users/update/${currentUser.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentUser.name,
            isAdmin: currentUser.isAdmin,
            birthDate: new Date(currentUser.birthDate).toLocaleDateString(
              "pt-BR",
              {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
            ),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      showToast("Usuário atualizado com sucesso", "success");
      setIsModalOpen(false);
    } catch (error) {
      showToast("Erro ao atualizar usuário", "error");
    } finally {
      showFeedback("", false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    showFeedback("Enviando imagem", true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/drive/upload/${currentUser?.id}`,
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
      setTempImage(null);
    } finally {
      showFeedback("", false);
      setTempImage(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();

    const nameMatch = user.name?.toLowerCase().includes(searchLower);

    const dateMatch = user.birthDate?.toLowerCase().includes(searchLower);

    let monthMatch = false;
    if (user.birthDate) {
      try {
        const date = parseISO(user.birthDate);
        const monthName = format(date, "MMMM", { locale: ptBR }).toLowerCase();
        monthMatch = monthName.includes(searchLower);
      } catch (e) {
        console.error("Data inválida:", user.birthDate);
      }
    }

    return nameMatch || dateMatch || monthMatch;
  });

  const SkeletonLoader = () => (
    <div className="space-y-4 mx-2 mt-4">
      <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
        >
          <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="nc-AdminUsersPage">
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
              <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
              <Input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-h-[150px] min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        E-mail
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Data de Cadastro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Última Atualização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap justify-center">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Avatar
                                imgUrl={tempImage || user?.profileImage}
                                sizeClass="w-full h-full"
                                userName={user?.name}
                              />

                              {/* Overlay para troca de imagem - arredondado */}
                              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>

                                {/* Input file escondido */}
                                <input
                                  type="file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e)}
                                />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {user.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {format(
                                  parseISO(user.birthDate),
                                  "d 'de' MMMM 'de' yyyy",
                                  {
                                    locale: ptBR,
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap justify-items-center text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap justify-items-center text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap justify-items-center text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap justify-items-center">
                          {user.isAdmin ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                        <td className="py-4 whitespace-nowrap text-center text-sm font-medium justify-items-center">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500 mb-2 flex items-center gap-1"
                          >
                            <PencilIcon className="h-4 w-4" /> Editar
                          </button>

                          <div className="relative group">
                            <button
                              disabled={authUser?.id === user.id}
                              onClick={() => handleDelete(user)}
                              className={`
                                flex items-center gap-1
                                ${
                                  authUser?.id === user.id
                                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                    : "text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                                }
                                transition-colors duration-200
                              `}
                            >
                              <TrashIcon className="h-4 w-4" /> Excluir
                            </button>

                            {authUser?.id === user.id && (
                              <div
                                className={`
                                  absolute z-20 w-full min-w-[150px] max-w-[150px]
                                  bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                                  rounded-lg shadow-lg p-2.5 right-full mr-2
                                  opacity-0 group-hover:opacity-100
                                  transition-all duration-300
                                  transform hover:scale-105
                                  break-words
                                  pointer-events-none
                                  group-hover:pointer-events-auto
                                `}
                                style={{
                                  top: "-70%",
                                }}
                              >
                                <div className="flex items-start">
                                  <p className="text-[0.7rem] text-wrap text-gray-700 dark:text-gray-200 break-words leading-snug">
                                    Você não pode excluir a si mesmo
                                  </p>
                                </div>
                                <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white dark:bg-gray-800 border-t border-r border-gray-100 dark:border-gray-700 transform rotate-45 -translate-y-1/2"></div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <NcModal
              isOpenProp={isModalOpen}
              onCloseModal={() => setIsModalOpen(false)}
              modalTitle="Editar Usuário"
              triggerText={false}
              contentExtraClass="max-w-[450px]"
              renderContent={() =>
                currentUser && (
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Nome
                      </label>
                      <Input
                        value={currentUser.name || ""}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        E-mail
                      </label>
                      <Input
                        value={currentUser.email || ""}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Data de Nascimento
                      </label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-calendar"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          type="date"
                          value={currentUser.birthDate}
                          onChange={(e) =>
                            setCurrentUser({
                              ...currentUser,
                              birthDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        className="items-center h-4 w-4 text-indigo-600 border-slate-300 rounded"
                        name="admin"
                        label="Administrador"
                        checked={currentUser.isAdmin}
                        onChange={(e) => {
                          console.log(e);
                          setCurrentUser({
                            ...currentUser,
                            isAdmin: e,
                          });
                        }}
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <ButtonPrimary sizeClass="px-3 py-1" type="submit">
                        Salvar
                      </ButtonPrimary>
                    </div>
                  </form>
                )
              }
            />

            <NcModal
              isOpenProp={isModalDeleteOpen}
              onCloseModal={() => setIsModalDeleteOpen(false)}
              modalTitle="Deletar Usuário"
              triggerText={false}
              contentExtraClass="max-w-[450px]"
              renderContent={() =>
                currentUser && (
                  <>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tem certeza que deseja excluir o usuário{" "}
                      <Badge
                        className="bg-red-500 text-white"
                        name={currentUser.name}
                      />{" "}
                      ?
                    </label>

                    <div className="flex justify-end space-x-3 pt-4">
                      <ButtonPrimary
                        sizeClass="px-3 py-1"
                        type="button"
                        onClick={() => handleDeleteUser(currentUser.id)}
                      >
                        Deletar
                      </ButtonPrimary>
                    </div>
                  </>
                )
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
