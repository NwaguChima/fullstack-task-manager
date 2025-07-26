import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import authRoute from './routes/authRoute';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import ExpressMongoSanitize from 'express-mongo-sanitize';

const app: Application = express();

// Security middleware (should be early in the middleware stack)
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10kb' }));

// Data sanitization middleware
app.use(ExpressMongoSanitize());
app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', authRoute);

// Catch-all handler for undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
