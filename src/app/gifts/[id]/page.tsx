import GiftDetails from "@/components/Gifts/ID/GiftDetails";

export default function Page({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <GiftDetails id={params.id} />;
}
