import { ErrorRequestHandler } from 'express';
import AppError from '../utils/appError';

interface CastError extends Error {
  path: string;
  value: any;
}

interface DuplicateError extends Error {
  code: number;
  keyValue: { [key: string]: any };
}

interface ValidationError extends Error {
  errors: { [key: string]: { message: string } };
}

const handleCastErrorDB = (err: CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: DuplicateError): AppError => {
  const value = err.keyValue?.['name'];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: ValidationError): AppError => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token!, please log in again', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, _req, res, _next) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, _req, res, _next) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other error: don't want to leak error details
    // 1) log error
    console.error(`Error 💥 🥵`, err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env?.['NODE_ENV'] === 'development') {
    sendErrorDev(err, req, res, next);
  } else if (process.env?.['NODE_ENV'] === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error as CastError);
    }
    if ((error as any).code === 11000) {
      error = handleDuplicateFieldsDB(error as DuplicateError);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error as ValidationError);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res, next);
  }
};

export default globalErrorHandler;
