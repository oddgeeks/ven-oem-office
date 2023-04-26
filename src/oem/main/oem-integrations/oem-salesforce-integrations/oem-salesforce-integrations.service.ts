import { Injectable } from '@nestjs/common';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OemSalesforceIntegrationEntity } from './oem-salesforce-integration.entity';

@Injectable()
@CommonDefaultMethodExtension
export class OemSalesforceIntegrationsService extends TypeOrmCrudService<OemSalesforceIntegrationEntity> {
  constructor(@InjectRepository(OemSalesforceIntegrationEntity) public repo) {
    super(repo);
  }
}
