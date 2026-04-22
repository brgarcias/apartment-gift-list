"use client";

import { Gift } from "@/types/gifts";
import GiftCard from "./GiftCard";

export default function GiftGrid({ gifts }: Readonly<{ gifts: Gift[] }>) {
  if (!gifts.length) {
    return (
      <p className="text-center text-gray-500">Nenhum presente encontrado.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gifts.map((gift) => (
        <GiftCard key={gift.id} gift={gift} />
      ))}
    </div>
  );
}
