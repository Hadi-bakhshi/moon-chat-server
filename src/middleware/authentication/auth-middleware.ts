import { Request, Response, NextFunction } from 'express';
import JWT from '../../utils/JWT';

const tokenErr = 'دسترسی ارسال نشده است';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      res.status(403).send({
        message: 'خطای دسترسی',
      });
      throw Error(tokenErr);
    }

    if (!token) {
      res.status(403).send({
        message: 'خطای دسترسی',
      });
    } else {
      try {
        const clientData = await JWT.decode(token);
        if (!!clientData) {
          res.locals.sessionUser = clientData;
          next();
        }
      } catch (error) {
        res.status(401).send({ message: 'دسترسی نامعتبر می باشد', error });
      }
    }
  } catch (error) {
    return res.status(401).json({
      error: error.message,
    });
  }
}
