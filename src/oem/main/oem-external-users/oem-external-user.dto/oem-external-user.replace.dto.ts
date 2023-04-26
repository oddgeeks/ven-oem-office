import { OmitType } from '@nestjs/swagger';
import { OemExternalUserDto } from './oem-external-user.dto';

export class OemExternalUserReplaceDto extends OmitType(OemExternalUserDto, [
  'externalUserId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {}
