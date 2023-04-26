import { OmitType } from '@nestjs/swagger';
import { OemLicensingProgramDto } from './oem-licensing-program.dto';
import { IsOptional } from 'class-validator';
import { LicensingProgramTypeEnum } from '../oem-licensing-program.enums/licensing-program-type.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class LicensingProgramUpdateDto extends OmitType(
  OemLicensingProgramDto,
  [
    'licensingProgramId',
    'company',
    'companyId',
    'companyChannel',
    'isEnabled',
    'createdAt',
    'updatedAt',
  ] as const,
) {
  @IsOptional()
  licensingProgramType: LicensingProgramTypeEnum;
  @IsOptional()
  licensingProgramName: string;
  @IsOptional()
  companyId: number;
  @IsOptional()
  discount: number;
}

export { LicensingProgramUpdateDto as OemLicensingProgramUpdateDto };
