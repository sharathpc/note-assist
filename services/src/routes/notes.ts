import { Router, Request, Response } from "express";

import { Notes } from "../aws";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await Notes.query("userId")
      .eq(req.headers["user-id"])
      .attributes([
        "noteId",
        "userId",
        "title",
        "content",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .exec();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

router.get("/:noteId", async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    const response = await Notes.query("noteId")
      .eq(noteId)
      .attributes([
        "noteId",
        "userId",
        "title",
        "content",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .exec();
    res.json(response[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const newNote = new Notes({
    ...req.body,
    userId: req.headers["user-id"],
  });
  try {
    const response = await newNote.save();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Note creation failed", error });
  }
});

router.put("/:noteId", async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const newNote = new Notes({
    ...req.body,
    noteId: noteId,
    userId: req.headers["user-id"],
  });
  try {
    const response = await newNote.save();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Note creation failed", error });
  }
});

router.delete("/:noteId", async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    const deleteNote = await Notes.get(noteId);
    const response = await deleteNote.delete();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Note deletion failed", error });
  }
});

export default router;
