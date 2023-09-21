import { Router } from 'express';
import { UserController } from '../controllers';
import isAuth from '../middlewares/isAuth';

const router = Router();

router.get('/me', isAuth, UserController.sendUserData);
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.post('/request-password-reset', UserController.requestPasswordReset);
router.post('/verify-reset-token', UserController.verifyResetToken);
router.post('/reset-password', UserController.resetPassword);

export { router as userRoutes };
