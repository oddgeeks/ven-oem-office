import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemHierarchyLevelEntity } from './oem-hierarchy-level.entity';
import { OemHierarchyLevelsService } from './oem-hierarchy-levels.service';
import { OemHierarchyLevelsController } from './oem-hierarchy-levels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemHierarchyLevelEntity])],
  providers: [OemHierarchyLevelsService],
  exports: [OemHierarchyLevelsService],
  controllers: [OemHierarchyLevelsController],
})
export class OemHierarchyLevelsModule {}
