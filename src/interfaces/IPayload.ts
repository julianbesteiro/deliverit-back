import { Types } from 'mongoose';

export interface Payload {
  id: Types.ObjectId;
  name: string;
  lastName: string;
  role: string;
  enabled: boolean;
  blockUntil?: Date | null;
  numberOfPacakagesPerDay: number;
  lastSeenAt: Date;
  urlImage: string;
}
