const mongoose = require('mongoose')

const schema = mongoose.Schema
const Joi = require('joi')
const roles = ["Admin", "User"];
const validateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    password: Joi.string().required().min(4),
    role: Joi.string().valid(...roles).required(),
    avatar: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const UserSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true

    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        default: "User"
    },
    // Store valid refresh tokens (rotation; supports multi-device)
    refreshTokens: [{
        type: String
    }]
},
    { timestamps: true }
)

const UserModel = mongoose.model('user', UserSchema)

module.exports = { UserModel, roles, loginSchema, validateSchema }