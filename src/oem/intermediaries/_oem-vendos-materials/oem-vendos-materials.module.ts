import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVendosMaterials } from './oem-vendos-materials.entity';
import { OemVendosMaterialsService } from './oem-vendos-materials.service';
import { OemVendosMaterialsController } from './oem-vendos-materials.controller';
import { IsMaterialInapplicable } from './oem-vendos-materials.validators/oem-vendos-materials.validators';
import { OemMaterialEntity } from '../../main/oem-materials/oem-material.entity';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemVendosMaterials,
      OemMaterialEntity,
      OemActionLogEntity,
    ]),
  ],
  providers: [OemVendosMaterialsService, IsMaterialInapplicable],
  exports: [OemVendosMaterialsService, IsMaterialInapplicable],
  controllers: [OemVendosMaterialsController],
})
export class OemVendosMaterialsModule {}
