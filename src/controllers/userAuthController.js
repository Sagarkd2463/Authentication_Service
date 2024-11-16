const { generateToken } = require('../middleware/identification');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { doHashPassword, doComparePassword } = require('../utils/hashing');

const userRegister = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already registered. Please login!" });
        }

        const hashedPassword = await doHashPassword(password);

        const newUser = await User.create({ name, email, password: hashedPassword, confirmpassword: hashedPassword });

        return res.status(201).json({ success: true, message: "User registered successfully!!!", newUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Registration failed...", error: error.message });
    }
};

const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all login required fields" });
        }

        const isUser = await User.findOne({ email });

        const token = await generateToken(isUser._id);

        if (!isUser) {
            return res.status(400).json({ success: false, message: "User not found. Please register yourself!!" });
        }

        const isMatchPassword = await doComparePassword(password, isUser.password);

        if (!isMatchPassword) {
            return res.status(400).json({ success: false, message: "Please provide valid credentials" });
        }

        return res.status(200).json({ success: true, message: "User logged successfully!!!", token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Login failed...", error: error.message });
    }
};

const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide a valid email" });
        }

        const checkUser = await User.findOne({ email });

        if (!checkUser) {
            return res.status(400).json({ success: false, message: "User not found. Please register yourself!!" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
                pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
            },
        });

        const receiver = {
            from: "deshpandesagar15613@gmail.com",
            to: email,
            subject: "Reset Password Request",
            text: `Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`,
        };

        await transporter.sendMail(receiver);

        return res.status(200).json({ success: true, message: "Password reset link has been send successfully on your email, Please check it!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to send reset password link", error: error.message });
    }
};

const resetPassword = async (req, res) => {

    try {
        const { token } = req.params;
        const { password, confirmpassword } = req.body;

        if (!password && !confirmpassword) {
            return res.status(400).json({ success: false, message: "Please provide a password" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findOne({ email: decode.email });

        const newHashPassword = await doHashPassword(password);
        user.password = newHashPassword;
        user.confirmpassword = newHashPassword;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully!!!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to reset password", error: error.message });
    }
};

module.exports = { userRegister, userLogin, forgotPassword, resetPassword };