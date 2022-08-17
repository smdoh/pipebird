import { Router } from "express";

const destinationRouter = Router();

// List destinations
destinationRouter.get("/", async (req, res) => {});

// Create destination
destinationRouter.post("/", async (req, res) => {});

// Get destination
destinationRouter.get("/:destination_id", async (req, res) => {});

export { destinationRouter };
