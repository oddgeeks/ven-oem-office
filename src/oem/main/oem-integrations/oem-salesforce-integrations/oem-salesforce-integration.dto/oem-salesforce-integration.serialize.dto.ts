import { OmitType } from '@nestjs/swagger';
import { OemSalesforceIntegrationDto } from './oem-salesforce-integration.dto';
import { Transform } from 'class-transformer';

export class SalesforceIntegrationSerializeDto extends OmitType(
  OemSalesforceIntegrationDto,
  ['isEnabled'] as const,
) {
  @Transform(({ value }) => `•••• •••• ${value.slice(-4)}`)
  salesforceClientSecret: string;

  @Transform(({ value }) => `•••• •••• ${value.slice(-4)}`)
  salesforcePassword: string;
}

export { SalesforceIntegrationSerializeDto as OemSalesforceIntegrationSerializeDto };
