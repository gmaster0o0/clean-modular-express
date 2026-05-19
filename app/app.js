import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { router as routerMiddleWare } from "./middlewares/routes.js";

import { globalErrorHandler } from "./middlewares/error.js";
import AppError from "./utils/app-error.js";
import { statusCodes } from "./utils/error-codes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compression());

routerMiddleWare(app);

app.use((req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      statusCodes.NOT_FOUND,
    ),
  );
});

app.use(globalErrorHandler);

export default app;
