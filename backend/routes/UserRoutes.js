import express from 'express';
import { GetUserDetails, LoginUser, RegisterUser, UpdateUserDetails, checkEMail } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', RegisterUser);
userRouter.post('/check-email', checkEMail);
userRouter.post('/login',LoginUser)
userRouter.post('/get-details',GetUserDetails)
userRouter.post('/update-details',UpdateUserDetails)

export default userRouter;
