import { Injectable } from '@nestjs/common';
import { IsExists } from '../../../../../common/validators/is-exists.abstract.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OemShadingRule } from '../oem-shading-rule.entity';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsShadingRuleExists extends IsExists<OemShadingRule> {
  constructor(
    @InjectRepository(OemShadingRule)
    repo: Repository<OemShadingRule>,
  ) {
    super(repo);
  }
}
