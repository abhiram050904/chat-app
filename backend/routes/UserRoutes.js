import express from 'express';
import { GetUserDetails, LoginUser, RegisterUser, UpdateUserDetails,LogoutUser, CheckEmail } from '../controllers/UserController.js';
import { userAuth } from '../middleware/UserAuth.js';
import upload from '../middleware/multer.js'
const userRouter = express.Router();

userRouter.post('/register',upload.single('image'), RegisterUser);
userRouter.post('/login',LoginUser)
userRouter.post('/get-details',userAuth,GetUserDetails)
userRouter.post('/update-details',upload.single('image'),userAuth,UpdateUserDetails)
userRouter.post('/logout', LogoutUser);
userRouter.post('/check-email', CheckEmail);

export default userRouter;
