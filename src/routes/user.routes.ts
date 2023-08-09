import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.get('/', UserController.userControllerTest);

export { router as userRoutes };
