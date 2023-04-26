import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemBundleEntity } from './oem-bundle.entity';
import { OemBundlesService } from './oem-bundles.service';
import { OemBundlesController } from './oem-bundles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemBundleEntity])],
  providers: [OemBundlesService],
  exports: [OemBundlesService],
  controllers: [OemBundlesController],
})
export class OemBundlesModule {}
