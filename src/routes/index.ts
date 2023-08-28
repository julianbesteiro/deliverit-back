import { Router } from 'express';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { allRoutes as orderRoutes } from './order.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/admin', adminRoutes);

export { router as allRoutes };
