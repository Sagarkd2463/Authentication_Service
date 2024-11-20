const { generateToken } = require('../middleware/identification');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { doHashPassword, doComparePassword } = require('../utils/hashing');

const userRegister = async (req, res) => {
    try {
        const { name, email, password, confirmpassword } = req.body;

        // Validate required fields
        if (!name || !email || !password || !confirmpassword) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        // Validate password match
        if (password !== confirmpassword) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "User already registered. Please login!" });
        }

        // Hash the password
        const hashedPassword = await doHashPassword(password);

        // Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
        });

        // Redirect for browser-based requests
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/login');
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully!!!",
            user: newUser,
        });
    } catch (error) {
        // Redirect to /error on any unhandled exception
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/error');
        }
        return res.status(500).json({
            success: false,
            message: "Registration failed...",
            error: error.message,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "Please provide all login required fields" });
        }

        // Check if the user exists
        const isUser = await User.findOne({ email });
        if (!isUser) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "User not found. Please register!" });
        }

        // Validate password
        const isMatchPassword = await doComparePassword(password, isUser.password);
        if (!isMatchPassword) {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                return res.redirect('/error');
            }
            return res.status(400).json({ success: false, message: "Invalid password credentials" });
        }

        // Generate token and set session
        const token = await generateToken(isUser._id);
        req.session.user = { id: isUser._id, name: isUser.name, email: isUser.email };

        // Redirect for browser-based requests
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/profile');
        }

        return res.status(200).json({
            success: true,
            message: "User login successfull!!!",
            token,
        });
    } catch (error) {
        // Handle unexpected errors
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/error');
        }
        return res.status(500).json({
            success: false,
            message: "Login failed...",
            error: error.message,
        });
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

        return res.status(200).json({
            success: true,
            message: "Password reset link has been send successfully on your email, Please check it!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send reset password link",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {

    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "Please provide a password" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode?.email) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const user = await User.findOne({ email: decode.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newHashPassword = await doHashPassword(password);
        user.password = newHashPassword;

        await user.save();

        // Check if the request is expecting HTML (e.g., from a browser)
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/login');
        }

        if (!req.headers['accept'] && !req.headers['accept'].includes('text/html')) {
            return res.redirect('/error');
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};

module.exports = { userRegister, userLogin, forgotPassword, resetPassword };