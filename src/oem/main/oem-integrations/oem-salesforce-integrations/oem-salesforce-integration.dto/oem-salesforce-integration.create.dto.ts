import { OmitType } from '@nestjs/swagger';
import { OemSalesforceIntegrationDto } from './oem-salesforce-integration.dto';

export class SalesforceIntegrationCreateDto extends OmitType(
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

export { SalesforceIntegrationCreateDto as OemSalesforceIntegrationCreateDto };
