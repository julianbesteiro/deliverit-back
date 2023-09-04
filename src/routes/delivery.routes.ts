import { DeliveryController } from '@/controllers/delivery.controller';
import DeliveryModel from '@/models/Delivery';
import DeliveryRepository from '@/repository/delivery.repository';
import DeliveryService from '@/services/delivery.service';
import { Router } from 'express';

const router = Router();

const deliveryRepository = new DeliveryRepository(DeliveryModel);
const deliveryService = new DeliveryService(deliveryRepository);
const deliveryController = new DeliveryController(deliveryService);

router.get('/all', deliveryController.getDeliveries);
router.get('/:id', deliveryController.getDelivery);
router.get('/user/:id', deliveryController.getDeliveriesByUser);
router.post('/', deliveryController.createDelivery);
router.put('/', deliveryController.updateDelivery);
router.delete('/:id', deliveryController.deleteDelivery);
router.patch('/:id', deliveryController.patchDelivery);

export { router as deliveryRouter };
