import Joi from 'Joi';


export const NewConversationSchema = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
});
