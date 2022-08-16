import { Router } from "express";
import { healthzRouter } from "./healthz.js";

const indexRouter = Router();

indexRouter.use("/healthz", healthzRouter);

export { indexRouter };
