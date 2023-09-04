import { Router } from 'express';
import { UserController } from '@/controllers';
import isAuth from '../middlewares/isAuth';

const router = Router();

router.get('/me', isAuth, UserController.getUserData);
router.get('/', UserController.userControllerTest);
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/forgot-password', UserController.forgotPassword);

export { router as userRoutes };
