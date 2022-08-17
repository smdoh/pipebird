import { Router } from "express";

const sourceRouter = Router();

// List sources
sourceRouter.get("/", async (req, res) => {});

// Create source
sourceRouter.post("/", async (req, res) => {});

// Get source
sourceRouter.get("/:source_id", async (req, res) => {});

export { sourceRouter };
