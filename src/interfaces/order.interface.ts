import { Order } from "@prisma/client";

export interface OrderOperationResult {
  success: boolean;
  order?: Order;
  error?: string;
}
