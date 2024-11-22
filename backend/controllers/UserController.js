import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password, profile_pic } = req.body;
        const imageFile = req.file; 

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const checkMail = await UserModel.findOne({ email });

        if (checkMail) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            imageUrl = imageUpload.secure_url;
        }
        const newUser = new UserModel({ name, email, password: hashedPassword, profile_pic:imageUrl });
        const data = await newUser.save();

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(201).json({ message: "User registered successfully", success: true, data, token });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({ message: "Login successful", success: true, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const GetUserDetails = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "No userId provided" });
        }

        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User details retrieved successfully", data: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const UpdateUserDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        const { name, email} = req.body;
        const imageFile = req.file; 

        // console.log(imageFile);

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email},
            { new: true }
        );

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;
            updatedUser.profile_pic = imageUrl;
            await updatedUser.save();
        }

        res.json({ success: true, message: "Profile updated", userData: updatedUser });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err.message });
    }
};

const LogoutUser = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


const CheckEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(200).json({ success: true, message: "Email exists" });
        } else {
            return res.status(404).json({ success: false, message: "Email does not exist" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export { RegisterUser, LoginUser, GetUserDetails, UpdateUserDetails, LogoutUser,CheckEmail };