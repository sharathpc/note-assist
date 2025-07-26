import { Router } from "express";

import usersRoutes from './users';
import notesRoutes from './notes';

const router = Router();
export function setRoutes(app: Router) {
  
  app.use("/api/users", usersRoutes);
  app.use("/api/notes", notesRoutes);

  return router;
}
