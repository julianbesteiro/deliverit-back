import mongoose, { Model } from 'mongoose';
import { swornSchema } from '../schemas';
import { ISworn } from '../interfaces';

const SwornModel: Model<ISworn> = mongoose.models.Sworn || mongoose.model('Sworn', swornSchema);

export default SwornModel;
