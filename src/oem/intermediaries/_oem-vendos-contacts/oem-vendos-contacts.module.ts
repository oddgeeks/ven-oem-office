import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVendosContacts } from './oem-vendos-contacts.entity';
import { OemVendosContactsService } from './oem-vendos-contacts.service';
import { OemVendosContactsController } from './oem-vendos-contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemVendosContacts])],
  providers: [OemVendosContactsService],
  exports: [OemVendosContactsService],
  controllers: [OemVendosContactsController],
})
export class OemVendosContactsModule {}
