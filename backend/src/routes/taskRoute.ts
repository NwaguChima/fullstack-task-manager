import express from 'express';
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskInsights,
} from '../controllers/taskController';
import { protect } from '../controllers/authController';
import {
  validateCreateTask,
  validateTaskId,
  validateTaskQuery,
  validateUpdateTask,
} from '../middlewares/validation';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Task insights route
router.get('/insights', getTaskInsights);

// CRUD routes
router
  .route('/')
  .get(validateTaskQuery, getAllTasks)
  .post(validateCreateTask, createTask);

router
  .route('/:id')
  .get(validateTaskId, getTask)
  .patch(validateTaskId, validateUpdateTask, updateTask)
  .delete(validateTaskId, deleteTask);

export default router;
