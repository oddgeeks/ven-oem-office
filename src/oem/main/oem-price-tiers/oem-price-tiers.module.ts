import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemPriceTierEntity } from './oem-price-tier.entity';
import { OemPriceTiersService } from './oem-price-tiers.service';
import { OemPriceTiersController } from './oem-price-tiers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemPriceTierEntity])],
  providers: [OemPriceTiersService],
  exports: [OemPriceTiersService],
  controllers: [OemPriceTiersController],
})
export class OemPriceTiersModule {}
