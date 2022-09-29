import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


type TDecoded = string | JwtPayload | undefined;

function signAccess(data: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(
      data,
      process.env.PRIVATE_KEY,
      { expiresIn: '12h', algorithm: 'RS256' },
      (err, token) => {
        err ? reject(err) : resolve(token || '');
      }
    );
  });
}

function decode(jwt: string): Promise<TDecoded | any> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, process.env.PUBLIC_KEY, (err, decoded) => {
      return err ? rej(err) : res(decoded);
    });
  });
}

export default {
  signAccess,
  decode,
};
