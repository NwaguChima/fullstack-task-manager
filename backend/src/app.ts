import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import authRoute from './routes/authRoute';
import taskRoute from './routes/taskRoute';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app: Application = express();

// Security middleware (should be early in the middleware stack)
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10kb' }));

// Data sanitization middleware
// app.use(expressMongoSanitize());
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
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tasks', taskRoute);

// API documentation route
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Task Manager API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/v1/auth/signup',
        login: 'POST /api/v1/auth/login',
      },
      tasks: {
        getAllTasks: 'GET /api/v1/tasks',
        createTask: 'POST /api/v1/tasks',
        getTask: 'GET /api/v1/tasks/:id',
        updateTask: 'PATCH /api/v1/tasks/:id',
        deleteTask: 'DELETE /api/v1/tasks/:id',
        getInsights: 'GET /api/v1/tasks/insights',
        bulkUpdate: 'PATCH /api/v1/tasks/bulk-update',
      },
    },
  });
});

// Catch-all handler for undefined routes
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
