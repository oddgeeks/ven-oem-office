import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Connection, createConnection, getConnection } from 'typeorm';
import { TenantsService } from '../../shared/tenants/tenants.service';
import { get } from 'async-local-storage';

@Injectable()
export class ConnectionMiddleware implements NestMiddleware {
  constructor(private readonly service: TenantsService) {}

  async use(req: any, res: any, next: () => void): Promise<any> {
    try {
      const tenant: string = await get('tenant');
      //if it cant find it generates an exception
      getConnection(tenant.toLowerCase());
      next();
    } catch (e) {
      const tenant = await this.service.getTenantFromNamespace();
      if (tenant) {
        //we get default connection to copy past options
        const options = {
          ...getConnection().options,
          name: String(tenant.name),
        };
        //there is might an issue that already ran create connection from previous request, and we need to catch it
        try {
          const createdConnection: Connection = await createConnection(options);
          if (createdConnection) {
            //console.debug('Connection created moved to next()');
            next();
          } else {
            new NotFoundException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        } catch (e) {
          //just inform
          console.debug('Cannot create an connection - moving to next()');
          //move to next()
          //ps. we do not carry if in some reason connection wouldn't be created, bc in SetCurrentTenant we will get an exception
          next();
        }
      } else {
        throw new NotFoundException('There is not such company name');
      }
    }
  }
}
