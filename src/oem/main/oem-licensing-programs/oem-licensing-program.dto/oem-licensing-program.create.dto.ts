import { OmitType } from '@nestjs/swagger';
import { OemLicensingProgramDto } from './oem-licensing-program.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class LicensingProgramCreateDto extends OmitType(
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
) {}

export { LicensingProgramCreateDto as OemLicensingProgramCreateDto };
