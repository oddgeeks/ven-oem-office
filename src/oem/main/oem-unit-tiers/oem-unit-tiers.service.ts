import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemUnitTierEntity } from './oem-unit-tier.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemUnitTiersService extends TypeOrmCrudService<OemUnitTierEntity> {
  constructor(@InjectRepository(OemUnitTierEntity) repo) {
    super(repo);
  }
}
