import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomUserReq } from '../types/custom';

interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
}

const signToken = (id: string) => {
  const expiresIn = process.env?.['JWT_EXPIRES_IN']! as any;

  console.log('xpires in', JSON.stringify(expiresIn));
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
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  };

  const newUser = await User.create(userData);

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 'fail', error: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res
      .status(401)
      .json({ status: 'fail', error: 'Incorrect email or password' });
  }

  createSendToken(user, 200, res);
});

export const protect = catchAsync(
  async (req: CustomUserReq, _res: Response, next: NextFunction) => {
    //1 ) Getting token and check if it exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in!, Please log in to get access.',
          401
        )
      );
    }

    //2) Validate token, verification
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist',
          401
        )
      );
    }

    //4) Check if user changed password after the token was issued.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // Grant access to protected route
    req.user = currentUser;

    next();
  }
);
