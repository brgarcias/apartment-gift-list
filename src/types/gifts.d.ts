import { GiftStatusEnum } from "@/enums/gift.enum";

export type Gift = {
  id: number;
  name: string;
  price: number;
  description: string;
  purchaseLink: string;
  imageUrl: string;
  status: GiftStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  giftOnOrder: GiftOnOrder[];
  giftOnReservation: GiftOnReservation[];
};

export type UpdatePresenteDTO = Partial<Gift>;
