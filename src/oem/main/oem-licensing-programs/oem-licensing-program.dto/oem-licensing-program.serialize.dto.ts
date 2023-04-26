import { OemLicensingProgramDto } from './oem-licensing-program.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class LicensingProgramSerializeDto extends PartialType(
  OemLicensingProgramDto,
) {}

export { LicensingProgramSerializeDto as OemLicensingProgramSerializeDto };
