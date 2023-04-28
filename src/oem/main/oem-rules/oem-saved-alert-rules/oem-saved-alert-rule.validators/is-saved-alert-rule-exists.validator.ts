import { Injectable } from '@nestjs/common';
import { IsExists } from '../../../../../common/validators/is-exists.abstract.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemSavedAlertRule } from '../oem-saved-alert-rule.entity';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsSavedAlertRuleExists extends IsExists<OemSavedAlertRule> {
  constructor(
    @InjectRepository(OemSavedAlertRule)
    repo: Repository<OemSavedAlertRule>,
  ) {
    super(repo);
  }
}
