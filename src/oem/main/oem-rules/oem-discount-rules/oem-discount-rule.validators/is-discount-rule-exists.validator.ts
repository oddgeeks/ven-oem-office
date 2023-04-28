import { Injectable } from '@nestjs/common';
import { IsExists } from '../../../../../common/validators/is-exists.abstract.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemDiscountRuleEntity } from '../oem-discount-rule.entity';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsDiscountRuleExists extends IsExists<OemDiscountRuleEntity> {
  constructor(
    @InjectRepository(OemDiscountRuleEntity)
    repo: Repository<OemDiscountRuleEntity>,
  ) {
    super(repo);
  }
}
