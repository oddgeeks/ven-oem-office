import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { OemCompanyChannel } from './oem-company-channel.entity';
import { OemCompanyChannelUpdateDto } from './oem-company-channel.dto/oem-company-channel.update.dto';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { OemCompanyChannelSetting } from '../_oem-company-channels-settings/oem-company-channel-setting.entity';
import { OemCompanyChannelCreateDto } from './oem-company-channel.dto/oem-company-channel.create.dto';
import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { CompanyChannelAddressEntity } from '../_oem-company-channel-addresses/oem-company-channel-addresses.entity';
import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';
import { AddressTypeEnum } from '../../main/oem-addresses/oem-address.enums/address-type.enum';
import { OemCompanyChannelReplaceDto } from './oem-company-channel.dto/oem-company-channel.replace.dto';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompanyChannelsService extends TypeOrmCrudService<OemCompanyChannel> {
  private readonly logger = new Logger(OemCompanyChannelsService.name);

  constructor(
    @InjectRepository(OemCompanyChannel)
    public repo: Repository<OemCompanyChannel>,
    @InjectRepository(OemCompanyChannelSetting)
    public repoCompanyChannelSetting: Repository<OemCompanyChannelSetting>,
    @InjectRepository(OemAddressEntity)
    public repoAddressEntity: Repository<OemAddressEntity>,
    @InjectRepository(CompanyChannelAddressEntity)
    public repoCompanyChannelAddress: Repository<CompanyChannelAddressEntity>,
    @InjectRepository(OemChannelEntity)
    public repoChannel: Repository<OemChannelEntity>,
  ) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY_CHANNELS, ActionsEnum.CREATE)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemCompanyChannelCreateDto>,
  ): Promise<OemCompanyChannel> {
    const companyId = req['user'].companyId;
    const channel = await this.repoChannel.findOne(dto.channelId, {
      transaction: true,
    });

    const companyChannelSetting = await this.repoCompanyChannelSetting.save(
      this.repoCompanyChannelSetting.create({
        ...channel,
      }),
      { transaction: true },
    );

    dto['companyChannelSettingId'] =
      companyChannelSetting.companyChannelSettingId;

    const companyChannel = await super.createOne(req, dto);

    // Autocreate addresses
    for (const addressType of Object.values(AddressTypeEnum)) {
      const address = await this.repoAddressEntity.save(
        this.repoAddressEntity.create({
          companyId,
          address_1: '',
          city: '',
          zipCode: '',
          region: '',
          country: '-',
          isEnabled: true,
          addressType,
        }),
        { transaction: true },
      );

      await this.repoCompanyChannelAddress.save(
        this.repoCompanyChannelAddress.create({
          companyId,
          companyChannelId: companyChannel.companyChannelId,
          channelId: channel.channelId,
          addressId: address.addressId,
        }),
        { transaction: true },
      );
    }

    return companyChannel;
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY_CHANNELS, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemCompanyChannelUpdateDto>,
  ): Promise<OemCompanyChannel> {
    return super.updateOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY_CHANNELS, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemCompanyChannelReplaceDto>,
  ): Promise<OemCompanyChannel> {
    const companyChannel = await this.getOne(req).catch(() => null);
    if (companyChannel) {
      return super.replaceOne(req, dto);
    }

    return this.createOne(req, dto);
  }
}
