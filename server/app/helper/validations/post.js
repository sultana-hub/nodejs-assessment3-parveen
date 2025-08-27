const Joi = require('joi');

const postValidation = Joi.object({
  text: Joi.string().required().messages({
    'any.required': 'Text is required',
    'string.empty': 'Text cannot be empty'
  }),
  name: Joi.string().optional(),
  avatar: Joi.string().optional()
});

module.exports = postValidation;
