import { ISworn } from '../Entities/ISworn';

export interface ISwornService {
  createSworn(sworn: ISworn): Promise<ISworn>;
  deleteSworn(swornId: string): Promise<void>;
}
