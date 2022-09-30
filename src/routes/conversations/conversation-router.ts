import { Request, Response, Router } from 'express';
import Conversation from '../../models/Conversation';
import { NewConversationSchema } from '../../validation/conversation-validation';

const router = Router();

export const endpoints = {
  newConversation: '/new',
  getUserConversation: '/:userId',
  getTwoUsersConversation: '/:firstUserId/:secondUserId',
} as const;

// ------------------------- Create New Conversation
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

    const newConversation = new Conversation({
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
// ------------------------ get one user conversation
router.get(
  endpoints.getUserConversation,
  async (req: Request, res: Response) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      if (conversation.length === 0) {
        return res.status(400).json({
          message: 'There is no conversation',
        });
      }
      return res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
);

// --------------------------- get two user conversation
router.get(
  endpoints.getTwoUsersConversation,
  async (req: Request, res: Response) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });

      if (!conversation) {
        return res.status(400).json({
          message: 'There is no converstion to show',
        });
      }

      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
  }
);

export default router;
