import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OemSalesforceIntegrationEntity } from './oem-salesforce-integration.entity';

@Injectable()
export class OemSalesforceIntegrationRepository extends Repository<OemSalesforceIntegrationEntity> {
  constructor(@Inject('Crypt') public cryptr) {
    super();
  }
}
