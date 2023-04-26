import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuoteAndVendoUuid } from './oem-quote-and-vendo-uuid.entity';
import { OemQuoteAndVendoUuidsService } from './oem-quote-and-vendo-uuids.service';
import { OemQuoteAndVendoUuidsController } from './oem-quote-and-vendo-uuids.controller';
import { QuoteAndVendoLastUuidValidatorConstraint } from './oem-quote-and-vendo-uuid.validators/quote-and-vendo-uuid-lastUuid.validator';

@Module({
  imports: [TypeOrmModule.forFeature([OemQuoteAndVendoUuid])],
  providers: [
    OemQuoteAndVendoUuidsService,
    QuoteAndVendoLastUuidValidatorConstraint,
  ],
  exports: [OemQuoteAndVendoUuidsService],
  controllers: [OemQuoteAndVendoUuidsController],
})
export class OemQuoteAndVendoUuidsModule {}
