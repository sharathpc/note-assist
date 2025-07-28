import 'dotenv/config'

import express from 'express';
import { setRoutes } from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setRoutes(app);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
