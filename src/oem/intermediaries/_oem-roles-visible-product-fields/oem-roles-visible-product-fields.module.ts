import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemRolesVisibleProductFields } from './oem-roles-visible-product-fields.entity';
import { OemRolesVisibleProductFieldsService } from './oem-roles-visible-product-fields.service';
import { OemRolesVisibleProductFieldsController } from './oem-roles-visible-product-fields.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemRolesVisibleProductFields])],
  providers: [OemRolesVisibleProductFieldsService],
  exports: [OemRolesVisibleProductFieldsService],
  controllers: [OemRolesVisibleProductFieldsController],
})
export class OemRolesVisibleProductFieldsModule {}
