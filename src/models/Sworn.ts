import mongoose, { Model } from 'mongoose';
import { deliverySchema } from '../schemas';
import { ISworn } from '@/interfaces';

const SwornModel: Model<ISworn> = mongoose.models.Sworn || mongoose.model('Sworn', deliverySchema);

export default SwornModel;
