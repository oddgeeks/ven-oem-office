import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemHierarchyEntity } from './oem-hierarchy.entity';
import { OemHierarchiesService } from './oem-hierarchies.service';
import { OemHierarchyController } from './oem-hierarchies.controller';
import {
  IsGeoHierarchy,
  IsProductHierarchy,
} from './oem-hierarchy.validators/oem-hierarchy.validators';

@Module({
  imports: [TypeOrmModule.forFeature([OemHierarchyEntity])],
  providers: [OemHierarchiesService, IsProductHierarchy, IsGeoHierarchy],
  exports: [OemHierarchiesService, IsProductHierarchy, IsGeoHierarchy],
  controllers: [OemHierarchyController],
})
export class OemHierarchiesModule {}
