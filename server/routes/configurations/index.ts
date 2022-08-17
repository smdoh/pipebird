import { Router } from "express";

const configurationRouter = Router();

// List configurations
configurationRouter.get("/", async () => {});

// Create configuration
configurationRouter.post("/", async () => {});

// Get configuration
configurationRouter.get("/:configuration_id", async () => {});

export { configurationRouter };
