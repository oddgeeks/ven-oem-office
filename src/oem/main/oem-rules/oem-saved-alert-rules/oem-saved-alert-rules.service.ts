import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as _ from 'lodash';

import { OemSavedAlertRule } from './oem-saved-alert-rule.entity';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod()
export class OemSavedAlertRulesService extends TypeOrmCrudService<OemSavedAlertRule> {
  constructor(
    @InjectRepository(OemSavedAlertRule)
    repo: Repository<OemSavedAlertRule>,
  ) {
    super(repo);
  }

  async getClonedData(
    originalEntity: OemSavedAlertRule,
    manager: EntityManager,
  ) {
    return {
      ..._.omit(originalEntity, ['savedAlertRuleId', 'createdAt', 'updatedAt']),
      name: `Cloned from ${originalEntity.name}`,
    };
  }
}
