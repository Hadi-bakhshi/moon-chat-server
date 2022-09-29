import { Request, Response, Router } from 'express';
import authService from '../../services/Authentication/auth-service';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import {
  LoginValidation,
  RegisterValidation,
} from '../../validation/auth-validation';
import { BadRequestError } from '../../errors/badRequest/badRequest';

// Express Router
const router = Router();

// Endpoints
export const endpoints = {
  register: '/register',
  login: '/login',
} as const;

// ------------------------------------- Registeration -----------------
router.post(endpoints.register, async (req: Request, res: Response) => {
  try {
    const { error, value } = RegisterValidation.validate({ ...req.body });

    if (error) {
      throw new BadRequestError('Bad Request, Sent values are not valid');
    }
    const { username, email, phoneNumber, password } = value;
    const checkEmail = await User.findOne({ email });
    const checkPhoneNumber = await User.findOne({ phoneNumber });

    if (checkEmail) {
      return res.status(400).json({
        message: 'Email already exists!',
      });
    }

    if (checkPhoneNumber) {
      return res.status(400).json({
        message: 'PhoneNumber already exists!',
      });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      res.status(200).json({
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        accessToken: await authService.auth({
          username: savedUser.username,
        }),
        message: 'New User Registered',
      });
    } catch (error) {
      res.status(400).json({ message: 'Failed to register the user!' });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// ------------------------------------------- Login ----------------
router.post(endpoints.login, async (req: Request, res: Response) => {
  try {
    const { error, value } = LoginValidation.validate({ ...req.body });

    if (error) {
      return res.status(400).json({
        message: error.message,
        serverMessage: 'There is something wrong with sent values!',
      });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Password / Email is not correct',
      });
    }
    const checkThePassword = await bcrypt.compare(password, user.password);

    if (!checkThePassword) {
      return res.status(400).json({
        message: 'Password / Email is not correct',
      });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accessToken: await authService.auth({
        username: user.username,
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

export default router;
