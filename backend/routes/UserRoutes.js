import express from 'express';
import { GetUserDetails, LoginUser, RegisterUser, UpdateUserDetails,LogoutUser } from '../controllers/UserController.js';
import { userAuth } from '../middleware/UserAuth.js';
import upload from '../middleware/multer.js'
const userRouter = express.Router();

userRouter.post('/register', RegisterUser);
userRouter.post('/login',LoginUser)
userRouter.post('/get-details',userAuth,GetUserDetails)
userRouter.post('/update-details',upload.single('image'),userAuth,UpdateUserDetails)
userRouter.post('/logout', LogoutUser);

export default userRouter;
