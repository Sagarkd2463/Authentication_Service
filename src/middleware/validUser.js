const Joi = require('joi');
const { createHmac } = require('crypto');

const registeredUserValidate = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(6).max(60).required().email({ tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }

    next();
};

const loginUserValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).max(60).required().email({ tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }

    next();
};

const hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
};

const acceptCodeValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).max(60).required().email({ tlds: { allow: ['com', 'net'] } }),
        providedCode: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }

    next();
};

module.exports = {
    registeredUserValidate,
    loginUserValidate,
    hmacProcess,
    acceptCodeValidate
};
