const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi')
//joi validation
const validateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    city: Joi.string().required(),
    phone: Joi.string().required().min(10),
    password: Joi.string().required().min(4),
    avatar: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        require: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },

    is_verify: {
        type: Boolean,
        default: false
    },
    isAdmin: { type: String, default: "user" } ,
     isBlock: { type: Boolean, default: false },
    date: {
        type: Date,
        default: Date.now
    }
});
const UserModel = mongoose.model('user', UserSchema);
module.exports = {UserModel,validateSchema,loginSchema}  