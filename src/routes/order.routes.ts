import { Router } from 'express';
import { OrderController } from '../controllers';

const router = Router();

router.get('/', OrderController.getOrder);
router.post('/', OrderController.createOrder);

export { router as allRoutes };
