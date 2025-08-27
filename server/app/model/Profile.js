const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

// const profileValidation = Joi.object({
//   handle: Joi.string().optional(),
//   status: Joi.string().required(),
//   skills: Joi.alternatives().try(
//     Joi.string(),
//     Joi.array().items(Joi.string())
//   ).required()
// }).options({ stripUnknown: true });

const profileValidation = Joi.object({
  handle: Joi.string().optional(),
  status: Joi.string().required(),
  skills: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).required(),
  company: Joi.string().optional(),
  website: Joi.string().optional(),
  location: Joi.string().optional(),
  bio: Joi.string().optional(),
  githubusername: Joi.string().optional(),
  social: Joi.object({
    youtube: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    facebook: Joi.string().uri().optional(),
    linkedin: Joi.string().uri().optional(),
    instagram: Joi.string().uri().optional()
  }).optional()
}).options({ stripUnknown: true });

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  handle: {
    type: String,
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const ProfileModel = mongoose.model('profile', ProfileSchema);
module.exports = { ProfileModel, profileValidation } 