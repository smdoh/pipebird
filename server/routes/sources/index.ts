import { Prisma } from "@prisma/client";
import { Response, Router } from "express";
import { db } from "../../../lib/db.js";
import {
  ApiResponse,
  ErrorApiSchema,
  ListApiResponse,
} from "../../../lib/handlers.js";
import { HttpStatusCode } from "../../../utils/http.js";
import { z } from "zod";
const sourceRouter = Router();

type SourceResponse = Prisma.SourceGetPayload<{
  select: {
    name: true;
    status: true;
    sourceType: true;
    id: true;
  };
}>;

// List sources
sourceRouter.get("/", async (_req, res: ListApiResponse<SourceResponse>) => {
  const sources = await db.source.findMany({
    select: {
      name: true,
      status: true,
      sourceType: true,
      id: true,
    },
  });
  return res.status(HttpStatusCode.OK).json({ content: sources });
});

// Create source
sourceRouter.post("/", async (req, res: ApiResponse<SourceResponse>) => {});

// Get source
sourceRouter.get("/:source_id", async () => {});

// Delete source
sourceRouter.delete(
  "/:source_id",
  async (req, res: Response<ErrorApiSchema>) => {
    const queryParams = z.object({});
  },
);

export { sourceRouter };
