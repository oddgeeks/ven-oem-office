import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as _ from 'lodash';

import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { OemCompanyChannelSetting } from '../../intermediaries/_oem-company-channels-settings/oem-company-channel-setting.entity';

export default (companyId = 1, channels: OemChannelEntity[]) =>
  class CreateCleanOemCompanyChannelSettings implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const emailPrefixes = ['distributor', 'reseller'];
      const companyChannelSettingEntities: OemCompanyChannelSetting[] = [];
      let companyChannelSettingId = 1;

      for (const channel of channels) {
        for (const emailPrefix of emailPrefixes) {
          const emailIndex = Math.ceil(companyChannelSettingId / 2);
          const companyChannelSetting: Partial<OemCompanyChannelSetting> = {
            ..._.omit(channel, ['createdAt', 'updatedAt']),
            companyChannelSettingId,
            companyId,
            contactEmail: `${emailPrefix}${emailIndex}@vendori.com`,
          };

          const companyChannelSettingEntity = await factory(
            OemCompanyChannelSetting,
          )().create(companyChannelSetting);

          companyChannelSettingEntities.push(companyChannelSettingEntity);

          companyChannelSettingId += 1;
        }
      }

      return companyChannelSettingEntities;
    }
  };
