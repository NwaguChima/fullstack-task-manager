import dotenv from 'dotenv';
dotenv.config();

import mongoDBConnect from './database/connect';
import app from './app';
import mongoose from 'mongoose';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

const startServer = async () => {
  try {
    // Connect to database first
    await mongoDBConnect();

    const port = process.env.PORT || 8000;

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err);

      server.close(async () => {
        await mongoose.connection.close();
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
