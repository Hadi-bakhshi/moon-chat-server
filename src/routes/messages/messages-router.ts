import { Request, Response, Router } from 'express';
import Message from '../../models/Message';
import { MessageSchema } from '../../validation/messages-validation';

const router = Router();

export const endpoints = {
  addNewMessage: '/new',
  getMessagesOfConversation: '/:conversationId',
} as const;

router.post(endpoints.addNewMessage, async (req: Request, res: Response) => {
  try {
    const { error, value } = MessageSchema.validate({ ...req.body });
    if (error) {
      return res.status(400).json({
        message: error,
        serverMessage: 'Sent value is not valid',
      });
    }

    const { newMessage, sender, conversationId } = value;
    const message = new Message({
        text:newMessage,
        sender,
        conversationId
    });

    const savedMessage = await message.save();

    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
});

router.get(
  endpoints.getMessagesOfConversation,
  async (req: Request, res: Response) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });

      if (messages.length === 0) {
        return res.status(400).json({
          message: 'There is no message in this conversation',
        });
      }

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
  }
);

export default router;
