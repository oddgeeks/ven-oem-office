import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemAddressEntity } from './oem-address.entity';
import { OemAddressesService } from './oem-addresses.service';
import { OemAddressesController } from './oem-addresses.controller';
import { TenantsModule } from '../../../shared/tenants/tenants.module';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemAddressEntity, OemActionLogEntity]),
    TenantsModule,
  ],
  providers: [OemAddressesService],
  exports: [OemAddressesService],
  controllers: [OemAddressesController],
})
export class OemAddressesModule {}
