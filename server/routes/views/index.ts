import { Router } from "express";

const viewRouter = Router();

// List views
viewRouter.get("/", async () => {});

// Create view
viewRouter.post("/", async () => {});

// Get view
viewRouter.get("/:view_id", async () => {});

export { viewRouter };
