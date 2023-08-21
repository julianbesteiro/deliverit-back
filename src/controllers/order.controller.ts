import { NextFunction, Request, Response } from 'express';
import { OrderService } from '../services';
import { CustomError } from '../interfaces/IError';

function isCustomError(error: unknown): error is CustomError {
  return (error as CustomError).name !== undefined || (error as CustomError).code !== undefined;
}

class OrderController {
  static async orderControllerTest(req: Request, res: Response) {
    try {
      const orderServiceData = await OrderService.orderServiceTest(1);

      return res.status(200).send({
        status: 200,
        message: 'Test Controller OK',
        order: orderServiceData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.body);
      return res.status(201).send(order);
    } catch (error: unknown) {
      let statusCode = 500;
      let message = 'An unexpected error occurred.';
      if (isCustomError(error)) {
        if (error.name === 'ValidationError') {
          statusCode = 400;
          message = error.message;
        } else if (error.code === 11000) {
          statusCode = 409;
          message = 'Order already exists.';
        }
      } else {
        console.log(error);
      }

      res.status(statusCode).send({ message, error });
      next(error);
    }
  }
}

export { OrderController };
