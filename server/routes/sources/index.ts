import { Prisma } from "@prisma/client";
import { Router } from "express";
import { ApiResponse } from "../../../lib/handlers.js";

const sourceRouter = Router();

type SourceResponse = Prisma.SourceGetPayload<{
  select: {
    name: true;
    status: true;
    source_type: true;
    id: true;
  };
}>;

// List sources
sourceRouter.get("/", async (req, res: ApiResponse<SourceResponse>) => {});

// Create source
sourceRouter.post("/", async (req, res: ApiResponse<SourceResponse>) => {});

// Get source
sourceRouter.get("/:source_id", async () => {});

// Delete source
sourceRouter.delete("/:source_id", async () => {});

export { sourceRouter };
