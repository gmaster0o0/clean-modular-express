import "dotenv/config";
import http from "http";

import app from "./app/app.js";
import { connectDB, disconnectDB } from "./prisma/db.js";

const port = process.env.PORT || 3000;

/**
 * Initialize the database
 */
connectDB();

/**
 * Start the server
 */
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/**
 * Handle uncaught exceptions
 */
process.on("unhandledRejection", async (err) => {
  await console.error("Unhandled Rejection:", err);
  httpServer.close(() => {
    disconnectDB();
    process.exit(1);
  });
});
