import expres, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';

const app = expres();

/*******************************************
 *             Some setting
 ***************************************** */

app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(cors({ Credential: true }));
app.use(cookieParser());
app.options('*', cors());

app.get('/test', (req: Request, res: Response) => {
  return res.json({
    statusCode: 200,
    isSuccess: true,
    message: 'API test',
  });
});
const server = http.createServer(app);

process.on('uncaughtException', (error, source) => {
  console.error('uncaughtException');
});

process.on('unhandledRejection', (error, source) => {
  console.error('unhandledRejection');
});

export default server;