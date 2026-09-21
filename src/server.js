import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRouter from '../src/routes/authRoutes.js'


import connectDB from './config/db.js';

const app = express();

dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// routes

app.use('/api/v1/auth', authRouter)



const port = process.env.PORT || 8002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`The server is running on port ${port}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();


