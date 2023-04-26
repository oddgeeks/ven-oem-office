import { OmitType } from '@nestjs/swagger';
import { OemUserDto } from './oem-user.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class UserUpdateDto extends OmitType(OemUserDto, [
  'userId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'ssoLoginEmail',
  'role',
  'companyChannel',
] as const) {
  @IsOptional()
  roleId: number;

  @IsOptional()
  geoHierarchyId: number;

  @IsOptional()
  organizationId: string | null;

  @IsOptional()
  prePopulatedFields: string[] | null;

  @IsOptional()
  imageUrl: string | null;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  notificationEmail: string | null;

  @IsOptional()
  phone: string;

  @IsOptional()
  password: string;

  @IsOptional()
  isExternal: boolean;

  @IsOptional()
  companyOrganisationName: string | null;

  /* /!**
   * The id of Address
   * @example 1
   *!/
  @IsNumber()
  @IsNotEmpty()
  addressId: number;*/

  @IsOptional()
  region: string;

  @IsOptional()
  timeZoneArea: string;

  @IsOptional()
  isHideWelcomeText: boolean;

  @IsOptional()
  isActive: boolean;
}

export { UserUpdateDto as OemUserUpdateDto };
