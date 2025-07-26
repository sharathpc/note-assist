import dotenv from 'dotenv';
import express from 'express';

//import { initializeAgent } from './agent';
import { setRoutes } from './routes/index';
import { initializeAws } from './aws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeAws();
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
