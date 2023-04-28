import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemDiscountRuleEntity } from './oem-discount-rule.entity';

import { ActionLogs } from '../../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../../common/decorators/set-clone-method.decorator';

@Injectable()
@SetCloneMethod(['DiscountRulesDiscounts'])
//in some reason CommonDefaultMethodExtension should come last otherwise method decorator from current class wouldn't be apply
//TODO: need to figure it, super strange thing
@CommonDefaultMethodExtension
export class OemDiscountRulesService extends TypeOrmCrudService<OemDiscountRuleEntity> {
  constructor(@InjectRepository(OemDiscountRuleEntity) public repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT_RULES, ActionsEnum.UPDATE)
  async updateOne(...args: []): Promise<OemDiscountRuleEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT_RULES, ActionsEnum.UPDATE)
  async replaceOne(...args: []): Promise<OemDiscountRuleEntity> {
    return super.replaceOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT_RULES, ActionsEnum.DELETE)
  async deleteOne(...args: []): Promise<OemDiscountRuleEntity> {
    return super.deleteOne.call(this, ...args);
  }
}
