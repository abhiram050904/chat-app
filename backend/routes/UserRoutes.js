import express from 'express';
import { LoginUser, RegisterUser, checkEMail } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', RegisterUser);
userRouter.post('/check-email', checkEMail);
userRouter.post('/login',LoginUser)

export default userRouter;
