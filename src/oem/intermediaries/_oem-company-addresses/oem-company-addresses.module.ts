import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyAddressesEntity } from './oem-company-addresses.entity';
import { OemCompanyAddressesService } from './oem-company-addresses.service';
import { OemCompanyAddressesController } from './oem-company-addresses.controller';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemCompanyAddressesEntity, OemActionLogEntity]),
  ],
  providers: [OemCompanyAddressesService],
  exports: [OemCompanyAddressesService],
  controllers: [OemCompanyAddressesController],
})
export class OemCompanyAddressesModule {}
