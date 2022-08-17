import { Router } from "express";

const viewRouter = Router();

// List views
viewRouter.get("/", async (req, res) => {});

// Create view
viewRouter.post("/", async (req, res) => {});

// Get view
viewRouter.get("/:view_id", async (req, res) => {});

export { viewRouter };
