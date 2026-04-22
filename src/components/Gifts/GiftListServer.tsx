import { getApiUrl } from "@/lib/api-url";
import GiftListClient from "./GiftListClient";

async function getGifts() {
  const res = await fetch(getApiUrl("/gifts"), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar presentes");
  }

  return res.json();
}

export default async function GiftListServer() {
  const gifts = await getGifts();

  return <GiftListClient initialGifts={gifts} />;
}
