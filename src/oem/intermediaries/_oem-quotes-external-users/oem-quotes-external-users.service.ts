import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Connection, EntityManager, Not, Repository } from 'typeorm';

import { OemQuotesExternalUsers } from './oem-quotes-external-users.entity';
import { OemQuotesUsersCreateDto } from './oem-quotes-external-users.dto/oem-quotes-users.create.dto';
import { OemQuotesUsersUpdateDto } from './oem-quotes-external-users.dto/oem-quotes-users.update.dto';
import { OemQuoteApprovalQueuesService } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.service';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { OemQuotesUsersService } from '../_oem-quotes-users/oem-quotes-users.service';
import { OemUsersService } from '../../main/oem-users/oem-users.service';
import { OemExternalUserEntity } from '../../main/oem-external-users/oem-external-user.entity';
import { OemQuotesUsersReplaceDto } from './oem-quotes-external-users.dto/oem-quotes-users.replace.dto';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesExternalUsersService extends TypeOrmCrudService<OemQuotesExternalUsers> {
  constructor(
    @InjectRepository(OemQuotesExternalUsers)
    public repo: Repository<OemQuotesExternalUsers> /* @InjectRepository(OemExternalUserEntity)
    public externalUserRepo: Repository<OemExternalUserEntity>,
    public usersService: OemUsersService,
    private quoteApprovalQueuesService: OemQuoteApprovalQueuesService,
    private quoteUsersService: OemQuotesUsersService,*/,
  ) {
    super(repo);
  }

  async getOne(req: CrudRequest) {
    return super.getOne(req);
  }

  /* /!**
   * Create an external user in userTable (happens only when we attach externalUser to quote)
   * @param req
   * @param dto
   * @private
   *!/
  private async _integrateSystemExternalUser(req, dto, integrate) {
    const externalUser = await this.externalUserRepo.findOne({
      externalUserId: dto.externalUserId,
    });
    dto = {
      ...dto,
      ...externalUser,
    };
    const systemExternalUser = await this.usersService.register({
      companyId: dto.companyId,
      firstName: dto.firstName,
      geoHierarchyId: 2,
      roleId: 3,
      organizationId: null,
      prePopulatedFields: ['Full Name'],
      imageUrl: null,
      lastName: dto.lastName,
      notificationEmail: dto.email,
      ssoLoginEmail: dto.email,
      password: null,
      phone: null,
      isExternal: true,
      region: 'system',
      timeZoneArea: 'US/Pacific',
      isHideWelcomeText: false,
      isActive: true,
      isEnabled: true,
    });
    dto.userId = systemExternalUser.userId;
    //await integrate(req, dto)
    return systemExternalUser;
  }

  async createOne(
    req: CrudRequest,
    dto: any,
  ): Promise<OemQuotesExternalUsers> {
    const res = super.createOne(req, dto);
    const systemExternalUser = await this._integrateSystemExternalUser(
      req,
      { ...res, ...dto },
      this.quoteUsersService.createOne,
    );
    dto = { ...res, ...dto }
    dto.userId = systemExternalUser.userId;
    await this.quoteUsersService.replaceOne(req, dto);
    return res;
  }

  async updateOne(
    req: CrudRequest,
    dto,
  ): Promise<OemQuotesExternalUsers> {
    const res = super.updateOne(req, dto);
    const systemExternalUser = await this._integrateSystemExternalUser(
      req,
      { ...res, ...dto },
      this.quoteUsersService.updateOne,
    );
    dto = { ...res, ...dto };
    dto.userId = systemExternalUser.userId;

    await this.quoteUsersService.updateOne(req, dto);
    return res;
  }

  async replaceOne(
    req: CrudRequest,
    dto,
  ): Promise<OemQuotesExternalUsers> {
    const res = super.replaceOne(req, dto);
    const systemExternalUser = await this._integrateSystemExternalUser(
      req,
      { ...res, ...dto },
      this.quoteUsersService.replaceOne,
    );
    dto = { ...res, ...dto };
    dto.userId = systemExternalUser.userId;
    console.log(dto);
    await this.quoteUsersService.replaceOne(req, dto);
    return res;
  }

  async deleteOne(req: CrudRequest): Promise<any> {
    const res = super.deleteOne(req);
    const systemExternalUser = await this._integrateSystemExternalUser(
      req,
      null,
      this.quoteUsersService.deleteOne,
    );
    await this.quoteUsersService.deleteOne(req);
    return res;
  }*/
}
