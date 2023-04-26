import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemMaterialEntity } from './oem-material.entity';
import { OemMaterialsService } from './oem-materials.service';
import { OemMaterialsController } from './oem-materials.controller';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemMaterialEntity, OemActionLogEntity])],
  providers: [OemMaterialsService],
  exports: [OemMaterialsService],
  controllers: [OemMaterialsController],
})
export class OemMaterialsModule {}
