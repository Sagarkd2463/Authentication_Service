const Joi = require('joi');

// Register validation schema
exports.registerValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z\s]+$/)
        .message('Name must contain only alphabets and spaces')
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must not exceed 50 characters',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),
    password: Joi.string()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
            'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
        )
        .required()
        .messages({
            'string.empty': 'Password is required',
        }),
    confirmpassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm password must match the password',
            'string.empty': 'Confirm password is required',
        }),
});

// Login validation schema 
exports.loginValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),
    password: Joi.string()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
            'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
        )
        .required()
        .messages({
            'string.empty': 'Password is required',
        }),
    confirmpassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm password must match the password',
            'string.empty': 'Confirm password is required',
        }),
});

// forgotPassword validation schema
exports.forgotPasswordValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),
});

// resetPassword validation schema 
exports.resetPasswordValidationSchema = Joi.object({
    password: Joi.string()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
            'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
        )
        .required()
        .messages({
            'string.empty': 'Password is required',
        }),
});

exports.validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages.message,
        });
    }
    next();
};
