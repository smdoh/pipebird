import { z } from "zod";

export const TransferStatus = z.enum([
  "STARTED",
  "PENDING",
  "COMPLETE",
  "FAILED",
  "CANCELLED",
]);
