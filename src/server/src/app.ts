import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import AuthRouter from './routes/auth';

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth', AuthRouter);

// Start listening
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});
