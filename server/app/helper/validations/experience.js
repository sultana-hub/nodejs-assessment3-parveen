const Joi = require('joi');

const experienceValidation = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty'
  }),
  company: Joi.string().required().messages({
    'any.required': 'Company is required',
    'string.empty': 'Company cannot be empty'
  }),
  location: Joi.string().optional(),
  from: Joi.date().required().messages({
    'any.required': 'From date is required',
    'date.base': 'From must be a valid date'
  }),
  to: Joi.date().optional(),
  current: Joi.boolean().optional(),
  description: Joi.string().optional()
});

module.exports =  experienceValidation ;
