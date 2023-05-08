import {
  BadGatewayException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { set } from 'async-local-storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    try {
      //so I would like to keep back compatible with subdomain functionality
      const source: string = (
        req.headers['x-company'] ||
        req.headers.origin ||
        req.headers.referrer ||
        req.headers.host
      ).toString();

      // console.log('source', source);
      const tenantName: string = source
        .split('.')[0]
        .toString()
        .replace(/http(s|)\:\/\//, '')
        .replace('undefined', '')
        .replace(/\:\d{1,4}/, '');

      // console.log('TenantMiddleware/SetTenant', tenantName);
      set('tenant', tenantName);

      next();
    } catch (e) {
      throw new BadGatewayException(
        'Cannot get tenant name from request headers',
      );
    }
  }
}
