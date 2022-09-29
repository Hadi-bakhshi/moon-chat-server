import Joi from 'joi';

export const RegisterValidation = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(50).required(),
  phoneNumber: Joi.string().min(6).required(),
});

export const LoginValidation = Joi.object({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().required(),
});
