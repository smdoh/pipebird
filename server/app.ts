import express from "express";
import { httpLogger } from "../lib/logger.js";
import { indexRouter } from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.disable("etag");

app.use(express.json());
app.use((req, res, next) => {
  httpLogger(req, res);
  next();
});

app.use(indexRouter);

export { app };
