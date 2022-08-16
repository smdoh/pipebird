import { Router } from "express";
import { accountsRouter } from "./accounts.js";
import { healthzRouter } from "./healthz.js";

const indexRouter = Router();

indexRouter.use("/healthz", healthzRouter);
indexRouter.use("/accounts", accountsRouter);

export { indexRouter };
