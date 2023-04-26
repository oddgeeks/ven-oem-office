import { OmitType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { VendoDto } from './oem-vendo.dto';
import { StatusUpdateValidator } from '../oem-vendo.validators/status-update.validator';
import { VendoStatusEnum } from '../oem-vendo.enums/vendo-status.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoCreateDto extends OmitType(VendoDto, [
  'companyId',
  'vendoId',
  'submittedAt',
  'daysSinceSubmission',
  'vendosUsers',
  'vendosQuotes',
  'isEnabled',
  'updatedAt',
  'createdAt',
] as const) {
  @Validate(StatusUpdateValidator)
  vendoStatus: VendoStatusEnum;
}

export { VendoCreateDto as OemVendoCreateDto };
