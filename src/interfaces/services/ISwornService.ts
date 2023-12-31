import { ISworn, SwornServiceResponse } from '../Entities/ISworn';

export interface ISwornService {
  createSworn(sworn: ISworn): Promise<SwornServiceResponse>;
}
