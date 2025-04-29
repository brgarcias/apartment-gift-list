import { GiftStatusEnum } from "@/enums/gift.enum";
import { Category } from "@prisma/client";

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
  Category: Category;
};

export type UpdatePresenteDTO = Partial<Gift>;
