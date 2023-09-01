// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export interface RequestExpress extends Request {
//   user: {
//     id: string;
//   };
// }

import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

interface CustomHeaders extends IncomingHttpHeaders {
  authorization?: string;
}

export interface RequestExpress extends Request {
  headers: CustomHeaders;
  user: {
    id: string;
  };
}
