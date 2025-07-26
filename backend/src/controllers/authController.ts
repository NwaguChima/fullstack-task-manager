import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserData, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';

interface UserData {
  name: string;
  email: string;
  password: string;
}

const signToken = (id: string) => {
  const expiresIn = process.env?.['JWT_EXPIRES_IN']! as any;

  return jwt.sign({ id }, process.env?.['JWT_SECRET'] as string, {
    expiresIn,
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user.id);

  const date =
    (process.env.JWT_COOKIE_EXPIRES_IN as unknown as number) *
    24 *
    60 *
    60 *
    1000;

  const cookieOptions = {
    expires: new Date(Date.now() + date),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  //set password to undefined to hide it.
  user.password = undefined as any;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req: Request, res: Response) => {
  const userData: UserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const newUser = await UserData.create(userData);

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 'fail', error: 'Please provide email and password' });
  }

  const user = await UserData.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res
      .status(401)
      .json({ status: 'fail', error: 'Incorrect email or password' });
  }

  createSendToken(user, 200, res);
});
