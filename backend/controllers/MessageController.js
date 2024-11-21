import { MessageModel } from "../models/ConversationModel.js";
import UserModel from "../models/UserModel.js";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GetallUsers=async(req,res)=>{
    try{

        const {userId}=req.body
        const presentUser=userId;
        const remainingUsers=await UserModel.find({_id:{$ne:presentUser}}).select('-password')
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,message:err.message})
    }
}

const GetMessages=async(req,res)=>{
    try{

        const {id:recieverId}=req.params
        const senderId=req.user._id;

        const messages=await MessageModel.find({
            $or:[
                {senderId:senderId,recieverId:recieverId},
                {senderId:recieverId,recieverId:senderId},
            ]
        })

        res.json(200).json(messages)
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,message:err.message})
    }
}


const SendMessage=async(req,res)=>{

    const {text,image}=req.body
    const {id:recieverId}=req.params
    const senderId=req.user._id;

    let imageUrl;
    if(image){
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;
    }
}

export {GetallUsers,GetMessages,SendMessage}