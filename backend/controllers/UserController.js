import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const RegisterUser = async (req, res) => {
    try {
        const { name, email, password, profile_pic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const checkMail = await UserModel.findOne({ email });

        if (checkMail) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ name, email, password: hashedPassword, profile_pic });
        const data = await newUser.save();

        return res.status(201).json({ message: "User registered successfully", success: true, data });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const checkEMail = async (req, res) => {
    try {
        const { email } = req.body;

        const checkmail = await UserModel.findOne({ email }).select('-password');

        if (!checkmail) {
            return res.status(400).json({ success: true, message: "User does not exist" });
        }

        return res.status(200).json({ success: true, message: "Email verified", data: checkmail });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
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

        return res.status(200).json({ message: "Login successful", success: true, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const GetUserDetails = async (req, res) => {
    try {
        const {token} = req.headers

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        const user = await UserModel.findById(decoded.userId).select('-password'); // Find user by ID and exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User details retrieved successfully", data: user });
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const UpdateUserDetails = async (req, res) => {
    try {
        const { token } = req.headers;
        const { name, email, password, profile_pic } = req.body;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (email) {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            user.email = email;
        }
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        if (profile_pic) user.profile_pic = profile_pic;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

export { RegisterUser, checkEMail, LoginUser, GetUserDetails, UpdateUserDetails };
