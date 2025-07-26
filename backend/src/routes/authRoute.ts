import express, { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validateLogin, validateSignup } from '../middlewares/validation';

const router: Router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;
