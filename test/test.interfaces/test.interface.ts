import { HttpServer } from '@nestjs/common';
import { METHODS } from '../test.enums/methods.enum';
import { Class } from '../../src/utils/class-type.util';

export interface ITest {
  httpServer: HttpServer | Promise<HttpServer>;
  method: METHODS;
  path: string;
  SerializeClass?: Class;
  message?: string;
  status?: number;
  origin?: string;
  access_token?: string;
}
