import { OemSalesforceIntegrationCreateDto } from './oem-salesforce-integration.create.dto';
import { OemSalesforceIntegrationUpdateDto } from './oem-salesforce-integration.update.dto';
import { OemSalesforceIntegrationReplaceDto } from './oem-salesforce-integration.replace.dto';
import { OemSalesforceIntegrationSerializeDto } from './oem-salesforce-integration.serialize.dto';

export const dto = {
  createMany: OemSalesforceIntegrationSerializeDto,
  create: OemSalesforceIntegrationCreateDto,
  update: OemSalesforceIntegrationUpdateDto,
  replace: OemSalesforceIntegrationReplaceDto,
};

export const serialize = {
  get: OemSalesforceIntegrationSerializeDto,
  //getMany: OemSalesforceIntegrationSerializeDto,
  delete: OemSalesforceIntegrationSerializeDto,
  update: OemSalesforceIntegrationSerializeDto,
  replace: OemSalesforceIntegrationSerializeDto,
};
