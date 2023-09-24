import { Types } from 'mongoose';

export interface Payload {
  id: Types.ObjectId;
  name: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
  blockUntil?: Date | null;
  lastSeenAt: Date;
  urlImage: string;
}
