import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemContactEntity } from './oem-contact.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { OemSalesforceService } from '../oem-salesforce/oem-salesforce.service';

@Injectable()
@CommonDefaultMethodExtension
export class OemContactsService extends TypeOrmCrudService<OemContactEntity> {
  constructor(
    @InjectRepository(OemContactEntity) repo,
    @Inject(OemSalesforceService)
    private readonly oemSFService: OemSalesforceService,
  ) {
    super(repo);
  }

  public async fetchSFContacts(req: any) {
    const { companyId } = req.user;
    return await this.oemSFService.getContacts(companyId);
  }
}
