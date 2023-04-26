import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemProductsRelationships } from './oem-products-relationships.entity';
import { OemProductsRelationshipsService } from './oem-products-relationships.service';
import { OemProductsRelationshipsController } from './oem-products-relationships.controller';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemProductsRelationships, OemActionLogEntity]),
  ],
  providers: [OemProductsRelationshipsService],
  exports: [OemProductsRelationshipsService],
  controllers: [OemProductsRelationshipsController],
})
export class OemProductsRelationshipsModule {}
