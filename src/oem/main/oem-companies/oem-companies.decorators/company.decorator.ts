import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { OemCompanyEntity } from '../oem-company.entity';

export const CurrentCompany = createParamDecorator(
  (data: keyof OemCompanyEntity, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    console.log({ req });
    //const userData = data ? user && user[data] : user;
    return req;
  },
);
