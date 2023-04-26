import { IsOptional } from 'class-validator';

import { OmitType } from '@nestjs/swagger';
import { OemExternalUserDto } from './oem-external-user.dto';

export class OemExternalUserUpdateDto extends OmitType(OemExternalUserDto, [
  'externalUserId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {
  @IsOptional()
  companyOrganisationName: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;
}
