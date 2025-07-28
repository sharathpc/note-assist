import { Router, Request, Response } from "express";

import usersRoutes from "./users";
import notesRoutes from "./notes";
import imagesRoutes from "./images";

const router = Router();

export function setRoutes(app: Router) {
  router.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Welcome to the Note Assist API",
    });
  });

  app.use("/api", router);
  app.use("/api/users", usersRoutes);
  app.use("/api/notes", notesRoutes);
  app.use("/api/images", imagesRoutes);
}
