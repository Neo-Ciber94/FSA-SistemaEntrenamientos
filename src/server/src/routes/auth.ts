import { Router } from 'express';

const AuthRouter = Router();

AuthRouter.get('/', (req, res) => {
  res.send('Hello World');
});

export default AuthRouter;
