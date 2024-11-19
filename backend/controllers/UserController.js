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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required", success: false });
        }

        const user = await UserModel.findOne({ name: username });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid username or password", success: false });
        }

        const token = jwt.sign({ userId: user._id, username: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({ message: "Login successful", success: true, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export { RegisterUser, checkEMail, LoginUser };
