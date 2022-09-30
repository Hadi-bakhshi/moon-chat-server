import { Router } from 'express';
import authRouter from './auth/auth-router';
import conversationRouter from './conversations/conversation-router';
import messageRouter from './messages/messages-router';
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/conversations', conversationRouter);
apiRouter.use('/messages', messageRouter);

export default apiRouter;
