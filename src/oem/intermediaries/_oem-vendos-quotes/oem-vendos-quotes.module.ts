import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVendosQuotes } from './oem-vendos-quotes.entity';
import { OemVendosQuotesService } from './oem-vendos-quotes.service';
import { OemVendosQuotesController } from './oem-vendos-quotes.controller';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemVendosQuotes, OemActionLogEntity])],
  providers: [OemVendosQuotesService],
  exports: [OemVendosQuotesService],
  controllers: [OemVendosQuotesController],
})
export class OemVendosQuotesModule {}
