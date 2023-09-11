import { Router } from 'express';
import { OrderController } from '../controllers';
import OrderModel from '@/models/Order';

const router = Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrder);
router.put('/:id', OrderController.updateOrder);
router.patch('/:id', OrderController.patchOrder)
router.delete('/:id', OrderController.deleteOrder)

export { router as allRoutes };