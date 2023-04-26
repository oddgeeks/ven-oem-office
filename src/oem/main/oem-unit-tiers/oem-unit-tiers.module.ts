import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemUnitTierEntity } from './oem-unit-tier.entity';
import { OemUnitTiersService } from './oem-unit-tiers.service';
import { OemUnitTiersController } from './oem-unit-tiers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemUnitTierEntity])],
  providers: [OemUnitTiersService],
  exports: [OemUnitTiersService],
  controllers: [OemUnitTiersController],
})
export class OemUnitTiersModule {}
