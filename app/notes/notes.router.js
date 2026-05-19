import express from "express";

const router = express.Router();
/* TODO : Implement notes router to handle notes related routes
import { NotesController } from "./notes.controller.js";

router.get("/", NotesController.getAllNotes);
router.post("/", NotesController.createNote);
router.get("/:id", NotesController.getNoteById);
router.put("/:id", NotesController.updateNote);
router.delete("/:id", NotesController.deleteNote);
*/
router.get("/", (req, res) => {
  res.send("Get all notes");
});
export default router;
