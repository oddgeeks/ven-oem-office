import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ShadingRule } from '../oem-shading-rule.entity';
import { ShadingRuleDto } from './oem-shading-rule.dto';

export class ShadingRuleSerializeDto extends PartialType(ShadingRuleDto) {
  constructor(data: Partial<ShadingRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { ShadingRuleSerializeDto as OemShadingRuleSerializeDto };
