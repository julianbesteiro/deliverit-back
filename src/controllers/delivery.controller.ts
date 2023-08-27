import { asyncHandler } from '@/utils/asyncHandler';

// Utilizando el alias para importar

class DeliveryController {
  public static createDelivery = asyncHandler(async () => {});

  public static getDelivery = asyncHandler(async () => {});

  public static getDeliveries = asyncHandler(async () => {});

  public static updateDelivery = asyncHandler(async () => {});

  public static deleteDelivery = asyncHandler(async () => {});

  public static getDeliveriesByUser = asyncHandler(async () => {});

  public static patchDelivery = asyncHandler(async () => {});
}

export { DeliveryController };
