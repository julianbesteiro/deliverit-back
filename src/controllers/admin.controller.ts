import { asyncHandler } from '@/utils/asyncHandler';

class AdminController {
  public static workerDataByDate = asyncHandler(async () => {});

  public static workerDataById = asyncHandler(async () => {});

  public static orderDataByDate = asyncHandler(async () => {});

  public static dataByDate = asyncHandler(async () => {});

  public static newOrder = asyncHandler(async () => {});

  public static orderToRemove = asyncHandler(async () => {});

  public static workerStatus = asyncHandler(async () => {});
}

export { AdminController };
