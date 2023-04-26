import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemPriceTierEntity } from './oem-price-tier.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemPriceTiersService extends TypeOrmCrudService<OemPriceTierEntity> {
  constructor(@InjectRepository(OemPriceTierEntity) repo) {
    super(repo);
  }
}
