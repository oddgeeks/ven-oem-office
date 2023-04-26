import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyChannelAddresses } from './oem-company-channel-addresses.entity';
import { OemCompanyChannelAddressesService } from './oem-company-channel-addresses.service';
import { OemCompanyChannelAddressesController } from './oem-company-channel-addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemCompanyChannelAddresses])],
  providers: [OemCompanyChannelAddressesService],
  exports: [OemCompanyChannelAddressesService],
  controllers: [OemCompanyChannelAddressesController],
})
export class OemCompanyChannelAddressesModule {}
