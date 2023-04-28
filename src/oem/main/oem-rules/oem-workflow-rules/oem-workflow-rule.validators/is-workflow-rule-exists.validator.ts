import { ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { IsExists } from '../../../../../common/validators/is-exists.abstract.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemWorkflowRule } from '../oem-workflow-rule.entity';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsWorkflowRuleExists extends IsExists<OemWorkflowRule> {
  constructor(
    @InjectRepository(OemWorkflowRule)
    repo: Repository<OemWorkflowRule>,
  ) {
    super(repo);
  }
}
