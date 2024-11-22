import { MessageModel } from "../models/ConversationModel.js";
import UserModel from "../models/UserModel.js";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GetallUsers = async (req, res) => {
    try {
        const { userId } = req.body;
        const presentUser = userId;
        const remainingUsers = await UserModel.find({ _id: { $ne: presentUser } }).select('-password');
        res.json({ remainingUsers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

const GetMessages = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        const messages = await MessageModel.find({
            $or: [
                { senderId: senderId, recieverId: recieverId },
                { senderId: recieverId, recieverId: senderId },
            ]
        });

        if(messages){
        res.status(200).json(messages); }
        else{
            res.status(200).json({message:"no messages"}); 
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

const SendMessage = async (req, res) => {
    const { text } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (req.file) {
        try {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
            imageUrl = imageUpload.secure_url;
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }
    }

    const newMessage = new MessageModel({
        senderId,
        recieverId,
        text,
        image: imageUrl
    });

    try {
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

export { GetallUsers, GetMessages, SendMessage };
