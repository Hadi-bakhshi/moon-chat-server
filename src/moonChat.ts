import expres, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
import * as socket from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = expres();
dotenv.config();
const port = process.env.PORT || 8000;

/*******************************************
 *             Some setting
 ***************************************** */

app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(cookieParser());
app.options('*', cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error(err));

app.get('/test', (req: Request, res: Response) => {
  return res.json({
    statusCode: 200,
    isSuccess: true,
    message: 'API test',
  });
});

const httpServer = createServer(app);

const io = new socket.Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  //when ceonnect
  console.log('a user connected.');

  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  //send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});


process.on('uncaughtException', (error, source) => {
  console.error('uncaughtException');
});

process.on('unhandledRejection', (error, source) => {
  console.error('unhandledRejection');
});

httpServer.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
