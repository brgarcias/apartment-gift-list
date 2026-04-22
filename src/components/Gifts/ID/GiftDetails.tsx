import { Gift } from "@/types/gifts";
import GiftDetailsClient from "./GiftDetailsClient";
import { getApiUrl } from "@/lib/api-url";

async function getGift(id: string): Promise<Gift> {
  const res = await fetch(getApiUrl(`/gifts/${id}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar presente");
  }

  return res.json();
}

export default async function GiftDetails({ id }: Readonly<{ id: string }>) {
  const gift = await getGift(id);

  return <GiftDetailsClient gift={gift} />;
}
