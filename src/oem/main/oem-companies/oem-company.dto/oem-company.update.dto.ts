import { OmitType } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';

import { OemCompanyDto } from './oem-company.dto';
import { PermitCreditCardsEnum } from '../oem-company.enums/permit-credit-cards.enum';
import { SettingsType } from '../oem-company.types/settings.type';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyUpdateDto extends OmitType(OemCompanyDto, [
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'roles',
  'companyAddress',
] as const) {
  @IsOptional()
  companyName: string;

  @IsOptional()
  companyEmail: string;

  @IsOptional()
  logoUrl: string | null;

  @ValidateIf((i) => i.websiteUrl !== '')
  @IsOptional()
  websiteUrl: string | null;

  @IsOptional()
  subdomain: string | null;

  @IsOptional()
  defaultQuoteExpiration: number | null;

  @IsOptional()
  bankName: string | null;

  @IsOptional()
  bankAccountNumber: string | null;

  @IsOptional()
  bankRoutingNumber: string | null;

  @IsOptional()
  dealAttributes: string[];

  @IsOptional()
  permitCreditCards: PermitCreditCardsEnum;

  @IsOptional()
  isPermitSigning: boolean;

  @IsOptional()
  phone: string;

  @IsOptional()
  settings: SettingsType;
}

export { CompanyUpdateDto as OemCompanyUpdateDto };
