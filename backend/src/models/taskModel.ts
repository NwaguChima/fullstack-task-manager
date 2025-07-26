import mongoose, { Document, Schema } from 'mongoose';

export const enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  extras?: Record<string, any>;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Task description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
        message: 'Status must be either pending, in-progress, or done',
      },
      default: TaskStatus.PENDING,
    },
    extras: {
      type: Schema.Types.Mixed,
      default: {},
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
