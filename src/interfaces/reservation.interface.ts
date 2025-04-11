import { Reservation } from "@prisma/client";

export interface ReservationOperationResult {
  success: boolean;
  reservation?: Reservation;
  error?: string;
}
