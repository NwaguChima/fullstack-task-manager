import { Response, NextFunction } from 'express';
import Task, { TaskStatus } from '../models/taskModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomUserReq } from '../types/custom';

interface TaskRequestBody {
  title: string;
  description?: string;
  status?: TaskStatus;
  extras?: Record<string, any>;
}

interface TaskQuery {
  status?: TaskStatus;
  page?: string;
  limit?: string;
  sort?: string;
}

// Get all tasks for the logged-in user
export const getAllTasks = catchAsync(
  async (req: CustomUserReq, res: Response) => {
    const {
      status,
      page = '1',
      limit = '10',
      sort = '-createdAt',
    } = req.query as TaskQuery;

    // Build query
    const query: any = { user: req?.user?.id };

    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTasks: total,
        hasNext: skip + tasks.length < total,
        hasPrev: parseInt(page) > 1,
      },
      data: {
        tasks,
      },
    });
  }
);

// Get a single task
export const getTask = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req?.user?.id,
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  }
);

// Create a new task
export const createTask = catchAsync(
  async (req: CustomUserReq, res: Response) => {
    const { title, description, status, extras }: TaskRequestBody = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'Task title is required',
      });
    }

    const taskData = {
      title: title.trim(),
      description: description?.trim(),
      status: status || 'pending',
      extras: extras || {},
      user: req?.user?.id,
    };

    const newTask = await Task.create(taskData);

    res.status(201).json({
      status: 'success',
      data: {
        task: newTask,
      },
    });
  }
);

// Update a task
export const updateTask = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const { title, description, status, extras }: TaskRequestBody = req.body;

    // Validate title if provided
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'Task title cannot be empty',
      });
    }

    const updateData: Partial<TaskRequestBody> = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (extras !== undefined) updateData.extras = extras;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req?.user?.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  }
);

// Delete a task
export const deleteTask = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req?.user?.id,
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

// Get task insights/statistics
export const getTaskInsights = catchAsync(
  async (req: CustomUserReq, res: Response) => {
    const userId = req?.user?.id;

    // Aggregate task statistics
    const insights = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          tasks: {
            $push: {
              id: '$_id',
              title: '$title',
              createdAt: '$createdAt',
            },
          },
        },
      },
    ]);

    // Get total count
    const totalTasks = await Task.countDocuments({ user: userId });

    // Format the response
    const statusCounts = {
      [TaskStatus.PENDING]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
    };

    const tasksByStatus: Record<string, any[]> = {
      [TaskStatus.PENDING]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };

    insights.forEach((insight) => {
      statusCounts[insight._id as keyof typeof statusCounts] = insight.count;
      tasksByStatus[insight._id] = insight.tasks;
    });

    // Calculate completion rate
    const completionRate =
      totalTasks > 0 ? Math.round((statusCounts.done / totalTasks) * 100) : 0;

    // Get recent tasks (last 5)
    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        insights: {
          totalTasks,
          statusCounts,
          completionRate,
          tasksByStatus,
          recentTasks,
        },
      },
    });
  }
);
