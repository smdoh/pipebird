import { Router } from "express";

const destinationRouter = Router();

// List destinations
destinationRouter.get("/", async () => {});

// Create destination
destinationRouter.post("/", async () => {});

// Get destination
destinationRouter.get("/:destination_id", async () => {});

export { destinationRouter };
