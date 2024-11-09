const transport = require('../middleware/sendMail');
const User = require('../models/userModel');
const { hmacProcess } = require('../utils/hashing');

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exists' });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: 'Password Verification',
            html: '<h2>' + codeValue + '</h2>'
        });

        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({
                success: true,
                message: 'Code sent successfully!',
            });
        }
        res.status(400).json({
            success: false,
            message: 'Code sent failed!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;

    try {
        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select("+verificationCode+verificationCodeValidation");

        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exists' });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({
                success: false,
                message: 'Something is wrong with the code!',
            });
        }

        if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(400).json({
                success: false,
                message: 'Code has been expired!',
            });
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({
                success: true,
                message: 'Your account has been verified!',
            });
        }
        res.status(400).json({
            success: false,
            message: 'Unexpected error occurred!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};