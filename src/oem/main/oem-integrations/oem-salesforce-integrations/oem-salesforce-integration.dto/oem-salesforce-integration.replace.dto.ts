import { OmitType } from '@nestjs/swagger';
import { OemSalesforceIntegrationDto } from './oem-salesforce-integration.dto';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class SalesforceIntegrationReplaceDto extends OmitType(
  OemSalesforceIntegrationDto,
  [
    'salesforceIntegrationId',
    'companyId',
    'salesforceClientSecretLast4',
    'createdAt',
    'updatedAt',
    'isEnabled',
  ] as const,
) {}

export { SalesforceIntegrationReplaceDto as OemSalesforceIntegrationReplaceDto };
