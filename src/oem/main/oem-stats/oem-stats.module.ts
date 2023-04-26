import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemStatsController } from './oem-stats.controller';
import { OemStatsService } from './oem-stats.service';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemHierarchyEntity, OemUserEntity])],
  providers: [OemStatsService],
  exports: [OemStatsService],
  controllers: [OemStatsController],
})
export class OemStatsModule {}
