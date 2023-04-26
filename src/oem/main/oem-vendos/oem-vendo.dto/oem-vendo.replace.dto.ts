import { OmitType } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';

import { VendoDto } from './oem-vendo.dto';
import { StatusUpdateValidator } from '../oem-vendo.validators/status-update.validator';
import { VendoStatusEnum } from '../oem-vendo.enums/vendo-status.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoReplaceDto extends OmitType(VendoDto, [
  'vendoId',
  'companyId',
  'ownerUserId',
  'vendoUuid',
  'submittedAt',
  'daysSinceSubmission',
  'vendosUsers',
  'vendosQuotes',
  'isEnabled',
  'isLocked',
  'createdAt',
  'updatedAt',
] as const) {
  @Validate(StatusUpdateValidator)
  vendoStatus: VendoStatusEnum;

  @IsOptional()
  netAmount: number;
}

export { VendoReplaceDto as OemVendoReplaceDto };
