import { Router } from "express";

import usersRoutes from './users';
import notesRoutes from './notes';
import imagesRoutes from './images';

const router = Router();
export function setRoutes(app: Router) {
  
  app.use("/api/users", usersRoutes);
  app.use("/api/notes", notesRoutes);
  app.use("/api/images", imagesRoutes);

  return router;
}
