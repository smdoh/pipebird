import { Router } from "express";

const configurationRouter = Router();

// List configurations
configurationRouter.get("/", async (req, res) => {});

// Create configuration
configurationRouter.post("/", async (req, res) => {});

// Get configuration
configurationRouter.get("/:configuration_id", async (req, res) => {});

export { configurationRouter };
