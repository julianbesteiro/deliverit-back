import { ValidStatus } from '../Entities/IDelivery';

export interface IDeliveryUpdateInput {
  status: ValidStatus;
}
