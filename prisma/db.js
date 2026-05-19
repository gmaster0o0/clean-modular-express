import "dotenv/config";
import { PrismaClient } from "@prisma/client/default.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import catchAsync from "../app/utils/catch-async.js";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: dbUrl,
  }),
});

export const connectDB = catchAsync(async () => {
  await prisma.$connect();
  console.log("Database connection successfully established.");
});

export const disconnectDB = catchAsync(async () => {
  await prisma.$disconnect();
  console.log("Database connection successfully closed.");
});
