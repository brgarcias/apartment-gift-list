import { GiftStatusEnum } from "@/enums/gift.enum";
import { Category, GiftOnOrder } from "@prisma/client";

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
  GiftOnOrder?: Array<{
    order: {
      id: number;
      user: {
        id: number;
      };
    };
  }>;
  giftOnReservation: GiftOnReservation[];
  categoryId: number;
  Category: Category;
};

export type UpdatePresenteDTO = Partial<Gift>;
