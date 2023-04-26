import { OmitType } from '@nestjs/swagger';
import { VendoDto } from './oem-vendo.dto';
import { IsOptional, Validate } from 'class-validator';

import { StatusUpdateValidator } from '../oem-vendo.validators/status-update.validator';
import { VendoStatusEnum } from '../oem-vendo.enums/vendo-status.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoUpdateDto extends OmitType(VendoDto, [
  'vendoId',
  'companyId',
  'ownerUserId',
  'vendoUuid',
  'submittedAt',
  'daysSinceSubmission',
  'vendosQuotes',
  'vendosUsers',
  'vendoUuid',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {
  @IsOptional()
  customerId: number;

  @IsOptional()
  opportunityId: string | null;

  @IsOptional()
  geoHierarchyId: number;

  @IsOptional()
  isExternal: boolean;

  @IsOptional()
  vendoName: string | null;

  @IsOptional()
  vendoComments: string | null;

  @IsOptional()
  expiresAt: Date | string;

  @IsOptional()
  isLocked: boolean;

  @IsOptional()
  netAmount: number;

  @Validate(StatusUpdateValidator)
  vendoStatus: VendoStatusEnum;
}

export { VendoUpdateDto as OemVendoUpdateDto };
