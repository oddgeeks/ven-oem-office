import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as _ from 'lodash';

import { OemPricingModelEntity } from './oem-pricing-model.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod(['UnitTier'])
export class OemPricingModelsService extends TypeOrmCrudService<OemPricingModelEntity> {
  constructor(
    @InjectRepository(OemPricingModelEntity)
    public repo: Repository<OemPricingModelEntity>,
  ) {
    super(repo);
  }

  async getClonedData(
    originalEntity: OemPricingModelEntity,
    manager: EntityManager,
  ) {
    return {
      ..._.omit(originalEntity, ['pricingModelId', 'createdAt', 'updatedAt']),
      modelName: `Cloned from ${originalEntity.modelName}`,
    };
  }
}
