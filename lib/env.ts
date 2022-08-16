import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.preprocess(Number, z.number()),
  DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
