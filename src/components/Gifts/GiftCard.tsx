"use client";

import { Gift } from "@/types/gifts";
import { GiftStatusEnum } from "@/enums/gift.enum";
import { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  gift: Gift;
}

function GiftCard({ gift }: Readonly<Props>) {
  const router = useRouter();
  const { user } = useAuth();

  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const purchasedByCurrentUser =
    gift.status.toLowerCase() === GiftStatusEnum.PURCHASED &&
    gift?.GiftOnOrder?.some((order) => order.order.user.id === user?.id);

  const statusMap: Record<
    GiftStatusEnum,
    {
      text: string;
      color: string;
    }
  > = {
    [GiftStatusEnum.AVAILABLE]: {
      text: "Disponível",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    },

    [GiftStatusEnum.PURCHASED]: {
      text: "Comprado",
      color: "bg-blue-800 text-blue-100 dark:bg-blue-100 dark:text-blue-900",
    },

    [GiftStatusEnum.RESERVED]: {
      text: "Reservado",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
  };

  const status = statusMap[gift.status];

  return (
    <article
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col ${
        gift.status.toLowerCase() === GiftStatusEnum.AVAILABLE
          ? ""
          : "opacity-70"
      }`}
      style={{ minHeight: 450 }}
    >
      {/* IMAGE */}
      <div className="rounded-t-lg h-48 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-4">
        <Image
          src={gift.imageUrl}
          alt={gift.name}
          width={200}
          height={200}
          draggable={false}
          className="object-contain h-full w-full"
          sizes="(max-width:768px) 100vw,
                 (max-width:1200px) 50vw,
                 33vw"
          priority={false}
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2 gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
            {gift.name}
          </h2>

          {status && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
            >
              {status.text}
            </span>
          )}
        </div>

        {gift.Category && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {gift.Category.name}
          </p>
        )}

        <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 my-2">
          {brlFormatter.format(gift.price)}
        </p>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
          <p>
            Adicionado em {new Date(gift.createdAt).toLocaleDateString("pt-BR")}
          </p>

          <p>
            Atualizado em {new Date(gift.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* USER PURCHASE BADGE */}
        {purchasedByCurrentUser && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">
            Você comprou este presente
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 pt-0">
        <ButtonPrimary
          onClick={() => router.push(`/gifts/${gift.id}`)}
          sizeClass="px-4 py-2 w-full"
          fontSize="text-sm sm:text-base font-medium"
        >
          Ver detalhes
        </ButtonPrimary>
      </div>
    </article>
  );
}

export default memo(GiftCard);
