import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import AppError from '../utils/appError';
import { TaskStatus } from '../models/taskModel';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  next();
};

// Task validation rules
export const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Task title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Task description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .withMessage('Status must be either pending, in-progress, or done'),

  body('extras')
    .optional()
    .isObject()
    .withMessage('Extras must be a valid JSON object'),

  handleValidationErrors,
];

export const validateUpdateTask = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Task title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Task description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .withMessage('Status must be either pending, in-progress, or done'),

  body('extras')
    .optional()
    .isObject()
    .withMessage('Extras must be a valid JSON object'),

  handleValidationErrors,
];

export const validateTaskId = [
  param('id').isMongoId().withMessage('Invalid task ID format'),

  handleValidationErrors,
];

export const validateTaskQuery = [
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status filter must be either pending, in-progress, or done'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn([
      'createdAt',
      '-createdAt',
      'updatedAt',
      '-updatedAt',
      'title',
      '-title',
      'status',
      '-status',
    ])
    .withMessage('Invalid sort parameter'),

  handleValidationErrors,
];

// Auth validation rules
export const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),

  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];
