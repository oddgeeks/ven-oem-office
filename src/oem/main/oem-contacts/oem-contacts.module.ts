import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemContactEntity } from './oem-contact.entity';
import { OemContactsService } from './oem-contacts.service';
import { OemContactsController } from './oem-contacts.controller';
import { OemSalesforceModule } from '../oem-salesforce/oem-salesforce.module';

@Module({
  imports: [TypeOrmModule.forFeature([OemContactEntity]), OemSalesforceModule],
  providers: [OemContactsService],
  exports: [OemContactsService],
  controllers: [OemContactsController],
})
export class OemContactsModule {}
