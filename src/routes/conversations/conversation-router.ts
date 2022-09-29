import { Request, Response, Router } from 'express';
import conversation from '../../models/Conversation';
import { NewConversationSchema } from '../../validation/conversation-validation';

const router = Router();

export const endpoints = {
  newConversation: '/new',
} as const;

router.post(endpoints.newConversation, async (req: Request, res: Response) => {
  try {
    const { error, value } = NewConversationSchema.validate({ ...req.body });

    if (error) {
      return res.status(400).json({
        message: error,
        serverMessage: 'There is something wrong with the sent values',
      });
    }
    const { senderId, receiverId } = value;

    const newConversation = new conversation({
      members: [senderId, receiverId],
    });
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
});

export default router;
