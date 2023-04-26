import { OmitType } from '@nestjs/swagger';
import { OemSalesforceIntegrationDto } from './oem-salesforce-integration.dto';
import { Exclude } from 'class-transformer';

export class SalesforceIntegrationSerializeDto extends OmitType(
  OemSalesforceIntegrationDto,
  ['salesforceClientSecret', 'salesforcePassword', 'isEnabled'] as const,
) {
  @Exclude()
  salesforceClientSecret: string;
  @Exclude()
  salesforcePassword: string;
}

export { SalesforceIntegrationSerializeDto as OemSalesforceIntegrationSerializeDto };
