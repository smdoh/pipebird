import { Router } from "express";
import { configurationRouter } from "./configurations/index.js";
import { destinationRouter } from "./destinations.ts/index.js";
import { healthzRouter } from "./healthz.js";
import { sourceRouter } from "./sources/index.js";
import { viewRouter } from "./views/index.js";

const indexRouter = Router();

indexRouter.use("/healthz", healthzRouter);
indexRouter.use("/configurations", configurationRouter);
indexRouter.use("/destinations", destinationRouter);
indexRouter.use("/sources", sourceRouter);
indexRouter.use("/views", viewRouter);

export { indexRouter };
