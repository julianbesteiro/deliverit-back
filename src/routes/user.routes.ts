import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.get('/', UserController.userControllerTest);
router.post('/signup', UserController.createUser);

export { router as userRoutes };
