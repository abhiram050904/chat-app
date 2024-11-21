import express from 'express'
import { userAuth } from '../middleware/UserAuth.js';
import {GetallUsers, GetMessages, SendMessage} from '../controllers/MessageController.js'
const messageRouter=express.Router();

messageRouter.get('/users',userAuth,GetallUsers);
messageRouter.get('/:id',userAuth,GetMessages);
messageRouter.post("/send/:id",userAuth,SendMessage)
export default messageRouter