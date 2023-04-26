import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesMaterials } from './oem-quotes-materials.entity';
import { OemQuotesMaterialsService } from './oem-quotes-materials.service';
import { OemQuotesMaterialsController } from './oem-quotes-materials.controller';
import { IsMaterialInapplicable } from './oem-quotes-materials.validators/oem-quotes-materials.validators';
import { OemMaterialEntity } from '../../main/oem-materials/oem-material.entity';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemQuotesMaterials,
      OemMaterialEntity,
      OemActionLogEntity,
    ]),
  ],
  providers: [OemQuotesMaterialsService, IsMaterialInapplicable],
  exports: [OemQuotesMaterialsService, IsMaterialInapplicable],
  controllers: [OemQuotesMaterialsController],
})
export class OemQuotesMaterialsModule {}
