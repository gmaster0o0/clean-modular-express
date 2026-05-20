import authRouter from "./auth/auth.router.js";
import usersRouter from "./users/user.router.js";

// Register all main application routes here
export const router = (app) => {
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);

  return app;
};
