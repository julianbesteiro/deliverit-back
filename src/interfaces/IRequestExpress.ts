import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

interface CustomHeaders extends IncomingHttpHeaders {
  authorization?: string;
}

export interface RequestExpress extends Request {
  headers: CustomHeaders;
  user: {
    id: string;
    enabled: boolean;
    blockUntil?: Date;
  };
}
