import notesRouter from "../notes/notes.router.js";
import authRouter from "../auth/auth.router.js";

export const router = (app) => {
  app.use("/notes", notesRouter);
  app.use("/auth", authRouter);
  return app;
};
