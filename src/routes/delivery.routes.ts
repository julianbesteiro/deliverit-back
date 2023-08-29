import { Router } from 'express';
import DeliveryService from '../services/delivery.service';
import DeliveryRepository from '../repository/delivery.repository';
import { DeliveryController } from '../controllers';
import DeliveryModel from '../models/Delivery';

const router = Router();

const deliveryRepository = new DeliveryRepository(DeliveryModel);
const deliveryService = new DeliveryService(deliveryRepository);
const deliveryController = new DeliveryController(deliveryService);

router.get('/', deliveryController.getDelivery);
router.post('/', deliveryController.createDelivery);

export { router as deliveryRouter };
