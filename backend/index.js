import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import 'dotenv/config';
import userRouter from './routes/UserRoutes.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import messageRouter from './routes/MessageRoute.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/message',messageRouter)
const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured');
};

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (err) {
        console.error(err);
    }
}

connectDb();

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
    connectCloudinary();
});
