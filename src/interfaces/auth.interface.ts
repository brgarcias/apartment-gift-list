import { User } from "@prisma/client";

export interface AuthOperationResult {
  success: boolean;
  user?: User;
  error?: string;
}
