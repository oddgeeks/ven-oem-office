import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuoteCompanyChannel } from './oem-quote-company-channel.entity';
import { OemQuoteCompanyChannelsService } from './oem-quote-company-channels.service';
import { OemQuoteCompanyChannelsController } from './oem-quote-company-channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemQuoteCompanyChannel])],
  providers: [OemQuoteCompanyChannelsService],
  exports: [OemQuoteCompanyChannelsService],
  controllers: [OemQuoteCompanyChannelsController],
})
export class OemQuoteCompanyChannelsModule {}
