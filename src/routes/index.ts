import { Router } from 'express';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { allRoutes as orderRoutes } from './order.routes';
import { deliveryRouter } from './delivery.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/delivery', deliveryRouter);

export { router as allRoutes };
