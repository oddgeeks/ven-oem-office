import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesContacts } from './oem-quotes-contacts.entity';
import { OemQuotesContactsService } from './oem-quotes-contacts.service';
import { OemQuotesContactsController } from './oem-quotes-contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemQuotesContacts])],
  providers: [OemQuotesContactsService],
  exports: [OemQuotesContactsService],
  controllers: [OemQuotesContactsController],
})
export class OemQuotesContactsModule {}
