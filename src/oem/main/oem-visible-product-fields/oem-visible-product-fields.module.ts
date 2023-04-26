import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVisibleProductFieldEntity } from './oem-visible-product-field.entity';
import { OemVisibleProductFieldsService } from './oem-visible-product-fields.service';
import { OemVisibleProductFieldsController } from './oem-visible-product-fields.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemVisibleProductFieldEntity])],
  providers: [OemVisibleProductFieldsService],
  exports: [OemVisibleProductFieldsService],
  controllers: [OemVisibleProductFieldsController],
})
export class OemVisibleProductFieldsModule {}
