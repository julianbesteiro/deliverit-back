import { Router } from 'express';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { allRoutes as orderRoutes } from './order.routes';
import { deliveryRouter } from './delivery.routes';
import { swornRouter } from './sworn.routes';
import isAuth from '../middlewares/isAuth';
import isAdmin from '../middlewares/isAdmin';

const router = Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/admin', isAdmin, adminRoutes);
router.use('/delivery', isAuth, deliveryRouter);
router.use('/sworn', isAuth, swornRouter);

export { router as allRoutes };
