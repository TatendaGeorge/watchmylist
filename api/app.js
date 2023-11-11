import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/userRoutes.js';
import tenantRouter from './routes/tenantRoutes.js';
import patientRouter from './routes/patientRoutes.js';
import productsRouter from './routes/productsRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send({ message: 'Hello, world!' });
});

app.use('/api/v1/', 
  userRouter,
  tenantRouter,
  patientRouter,
  productsRouter
  );

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8000, () => console.log('Server started on port 8000'));
  } catch (error) {
    console.log(error);
  }
}

startServer();
