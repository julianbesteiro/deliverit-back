import { DeliveryController } from '@/controllers/delivery.controller';
import DeliveryModel from '@/models/Delivery';
import DeliveryRepository from '@/repository/delivery.repository';
import DeliveryService from '@/services/delivery.service';
import { Router } from 'express';

const router = Router();

const deliveryRepository = new DeliveryRepository(DeliveryModel);
const deliveryService = new DeliveryService(deliveryRepository);
const deliveryController = new DeliveryController(deliveryService);

router.get('/:id', deliveryController.getDelivery);
router.post('/', deliveryController.createDelivery);

export { router as deliveryRouter };
