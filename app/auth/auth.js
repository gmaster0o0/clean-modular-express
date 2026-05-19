import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../prisma/db.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  baseURL: "http://localhost:3000/auth",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    disableDefaultHooks: true,
  },
});
