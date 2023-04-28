import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { OemVacationRule } from './oem-vacation-rule.entity';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../../common/decorators/set-clone-method.decorator';

@Injectable()
@SetCloneMethod()
@CommonDefaultMethodExtension
export class OemVacationRulesService extends TypeOrmCrudService<OemVacationRule> {
  constructor(
    @InjectRepository(OemVacationRule) repo: Repository<OemVacationRule>,
  ) {
    super(repo);
  }
}
