import { statusCodes } from "../utils/status-codes.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  const statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  const status = err.status || "error";

  if (
    (err.message && err.message.includes("UNIQUE constraint failed")) ||
    err.code === "P2002"
  ) {
    return res.status(statusCodes.CONFLICT).json({
      status: "fail",
      message: "Duplicate entry detected. Please use a unique value.",
    });
  }

  res.status(statusCode).json({
    status: status,
    message: err.message || "Internal Server Error",
  });
};
