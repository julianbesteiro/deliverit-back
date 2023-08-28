import { Router } from 'express';
import { AdminController } from '../controllers';

const router = Router();

router.get('/date/workers', AdminController.workerDataByDate);
router.get('/workers/id', AdminController.workerDataById);
router.get('/date/orders', AdminController.orderDataByDate);
router.get('/date', AdminController.dataByDate);
router.post('/orders/create', AdminController.newOrder);
router.delete('/orders/delete/id', AdminController.orderToRemove);
router.put('/edit-status/id', AdminController.workerStatus);

export { router as adminRoutes };
