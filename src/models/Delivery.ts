import mongoose, { Model } from 'mongoose';
import { IDelivery, ValidStatus } from '../interfaces';
import deliverySchema from '../schemas/deliverySchema';

// Método estático para actualizar el estado y establecer la fecha de inicio o resolución según el nuevo estado
deliverySchema.statics.updateStatusAndSetDates = async function (
  deliveryId: string,
  newStatus: ValidStatus,
) {
  const delivery = await this.findById(deliveryId);

  if (delivery) {
    if (delivery.status === 'pending' && newStatus === 'on-course') {
      delivery.status = newStatus;
      delivery.startingDate = new Date();
    } else if (
      delivery.status === 'on-course' &&
      (newStatus === 'delivered' || newStatus === 'cancelled')
    ) {
      delivery.status = newStatus;
      delivery.resolutionDate = new Date();
    }

    await delivery.save();
  }
};

const DeliveryModel: Model<IDelivery> =
  mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);

export default DeliveryModel;
