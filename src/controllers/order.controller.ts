import { asyncHandler } from '../../src/utils/asyncHandler';

// Utilizando el alias para importar

class OrderController {
  public static createOrder = asyncHandler(async () => {});

  public static getOrder = asyncHandler(async () => {});

  public static getOrders = asyncHandler(async () => {});

  public static updateOrder = asyncHandler(async () => {});

  public static deleteOrder = asyncHandler(async () => {});

  public static patchOrder = asyncHandler(async () => {});
}

export { OrderController };
