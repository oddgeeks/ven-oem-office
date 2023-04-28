import { IsNumber, Max, Min } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { ShadingRuleDto } from './oem-shading-rule.dto';

class ShadingRulePriorityDto extends PickType(ShadingRuleDto, [
  'priority',
] as const) {
  @Min(0)
  @Max(999)
  @IsNumber()
  priority: number;
}

export { ShadingRulePriorityDto as OemShadingRulePriorityDto };
