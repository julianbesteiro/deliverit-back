import { Router } from 'express';
import { userRoutes } from './user.routes';
import { allRoutes as orderRoutes } from './order.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);

export { router as allRoutes };
