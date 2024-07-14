const Joi = require('joi');

const registeredUserValidate = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).alphanum().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }

    next();
};

const loginUserValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).alphanum().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }

    next();
};

module.exports = {
    registeredUserValidate,
    loginUserValidate
};
