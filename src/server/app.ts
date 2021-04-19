import express from 'express';
import AuthRouter from './routes/auth';

const PORT = 3000;
const app = express();

app.use('/auth', AuthRouter);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});
