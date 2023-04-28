import { ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { IsExists } from '../../../../../common/validators/is-exists.abstract.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemVacationRule } from '../oem-vacation-rule.entity';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsVacationRuleExists extends IsExists<OemVacationRule> {
  constructor(
    @InjectRepository(OemVacationRule)
    repo: Repository<OemVacationRule>,
  ) {
    super(repo);
  }
}
