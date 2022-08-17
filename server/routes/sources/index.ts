import { Router } from "express";

const sourceRouter = Router();

// List sources
sourceRouter.get("/", async () => {});

// Create source
sourceRouter.post("/", async () => {});

// Get source
sourceRouter.get("/:source_id", async () => {});

export { sourceRouter };
