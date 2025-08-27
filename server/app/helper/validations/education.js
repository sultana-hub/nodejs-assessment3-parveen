const Joi = require('joi');

const educationValidation = Joi.object({
  school: Joi.string().required().messages({
    'any.required': 'School is required',
    'string.empty': 'School cannot be empty'
  }),
  degree: Joi.string().required().messages({
    'any.required': 'Degree is required',
    'string.empty': 'Degree cannot be empty'
  }),
  fieldofstudy: Joi.string().required().messages({
    'any.required': 'Field of study is required',
    'string.empty': 'Field of study cannot be empty'
  }),
  from: Joi.date().required().messages({
    'any.required': 'Start date is required',
    'date.base': 'From must be a valid date'
  }),
  to: Joi.alternatives().try(Joi.date(), Joi.allow('', null)).optional(),
  current: Joi.boolean().optional(),
  description: Joi.string().optional()
});

module.exports = educationValidation;
