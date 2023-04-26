import { OmitType } from '@nestjs/swagger';
import { OemSalesforceIntegrationDto } from './oem-salesforce-integration.dto';
import { IsOptional } from 'class-validator';

export class SalesforceIntegrationUpdateDto extends OmitType(
  OemSalesforceIntegrationDto,
  [
    'salesforceIntegrationId',
    'companyId',
    'salesforceClientSecretLast4',
    'createdAt',
    'updatedAt',
    'isEnabled',
  ] as const,
) {
  @IsOptional()
  salesforceClientId: string;
  @IsOptional()
  salesforceClientSecret: string;
  @IsOptional()
  salesforcePassword: string;
  @IsOptional()
  salesforceURL: string;
  @IsOptional()
  salesforceUsername: string;
  @IsOptional()
  settings: object;
}

export { SalesforceIntegrationUpdateDto as OemSalesforceIntegrationUpdateDto };
