import { asyncHandler } from '../../src/utils/asyncHandler';
import { Request, Response } from 'express';
import { OrderService } from '../services';



class OrderController {

  public static createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderService.createOrder(req.body);
    return res.status(201).json({
      message: 'Order created',
      data: order,
      status: 201,
    });      
  });

  public static getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderService.getOrders();
    return res.status(200).send(orders);
  });

  public static getOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id; 
    const order = await OrderService.getOrder(orderId);
    return res.status(200).send(order);
  });


  public static deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id; 
    const deletedOrder = await OrderService.deleteOrder(orderId);
    return res.status(200).json({
      message: 'Order deleted',
      data: deletedOrder,
      status: 200,
    });

  });


  public static updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id; 
    const updatedOrder = await OrderService.updateOrder(orderId, req.body);
    return res.status(200).send(updatedOrder);
  });


  public static patchOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id; 
    const updatedFields = req.body; 

    const patchedOrder = await OrderService.patchOrder(orderId, updatedFields);

    if (!patchedOrder) {
      return res.status(404).send({ message: 'Orden no encontrada' });
    }

    return res.status(200).send(patchedOrder);
  });
}

export { OrderController };
