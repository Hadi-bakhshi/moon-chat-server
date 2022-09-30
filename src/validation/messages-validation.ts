import Joi from 'Joi';

export const MessageSchema = Joi.object({
  newMessage: Joi.any().required(),
  conversationId: Joi.string().required(),
  sender: Joi.string().required(),
});
