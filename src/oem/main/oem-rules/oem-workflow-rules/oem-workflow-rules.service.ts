import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemWorkflowRule } from './oem-workflow-rule.entity';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { ActionLogs } from '../../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../oem-action-logs/oem-action-log.enums/actions.enum';
import { CrudRequest } from '@nestjsx/crud';
import { OemWorkflowRuleDto } from './oem-workflow-rule.dto/oem-workflow-rule.dto';
import { SetCloneMethod } from '../../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod()
export class OemWorkflowRulesService extends TypeOrmCrudService<OemWorkflowRule> {
  constructor(@InjectRepository(OemWorkflowRule) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.WORKFLOW_RULES, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemWorkflowRuleDto>,
  ): Promise<OemWorkflowRule> {
    return super.updateOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.WORKFLOW_RULES, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemWorkflowRuleDto>,
  ): Promise<OemWorkflowRule> {
    return super.replaceOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.WORKFLOW_RULES, ActionsEnum.DELETE)
  async deleteOne(req: CrudRequest): Promise<void | OemWorkflowRule> {
    return super.deleteOne(req);
  }
}
