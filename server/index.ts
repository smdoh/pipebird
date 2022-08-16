import http from "http";
import { app } from "./app.js";
import { env } from "../lib/env.js";
import { logger } from "../lib/logger.js";

http.createServer(app).listen(env.PORT, () => {
  logger.info(`Server listening on :${env.PORT}`);
});

process.on("uncaughtException", (error) => {
  logger.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  throw reason;
});
