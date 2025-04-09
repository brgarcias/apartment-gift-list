import { Gift } from "@prisma/client";

export interface GiftOperationResult {
  success: boolean;
  gift?: Gift;
  error?: string;
}
