import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemPricingModelEntity } from '../../main/oem-pricing-models/oem-pricing-model.entity';
import { ModelTypeEnum } from '../../main/oem-pricing-models/oem-pricing-model.enums/model-type.enum';
import { PricingTypeEnum } from '../../main/oem-pricing-models/oem-pricing-model.enums/pricing-type.enum';
import { UnitDurationEnum } from '../../main/oem-pricing-models/oem-pricing-model.enums/unit-duration.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemPricingModels implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const pricingModels = [
        {
          companyId,
          modelName: 'SaaS tiered',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.TIERED,
          unitMetric: 'user',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'subscription',
          modelType: ModelTypeEnum.Subscription,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'head',
          unitDuration: UnitDurationEnum.PER_CALENDAR_MONTH,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'SubscriptionService',
          modelType: ModelTypeEnum.Subscription,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'User',
          unitDuration: UnitDurationEnum.PER_CALENDAR_MONTH,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'SaaS tiered',
          modelType: ModelTypeEnum.Subscription,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'user',
          unitDuration: UnitDurationEnum.PER_WEEK,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'SaaS Products',
          modelType: ModelTypeEnum.Subscription,
          pricingType: PricingTypeEnum.TIERED,
          unitMetric: 'User',
          unitDuration: UnitDurationEnum.PER_CALENDAR_YEAR,
          tiersEnabled: true,
          isEnabled: true,
        },
        {
          companyId,
          modelName: 'Hardware',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'Unit',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: true,
        },
        {
          companyId,
          modelName: 'Services - Package',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.VOLUME,
          unitMetric: 'Hour',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: true,
        },
        {
          companyId,
          modelName: 'Services - Consumption',
          modelType: ModelTypeEnum.Consumption,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'Hour',
          unitDuration: UnitDurationEnum.CONSUMED,
          tiersEnabled: true,
          isEnabled: true,
        },
        {
          companyId,
          modelName: 'Test2 extyra 23',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'D',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'Test Extra',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.TIERED,
          unitMetric: 'D',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: false,
        },
        {
          companyId,
          modelName: 'sds',
          modelType: ModelTypeEnum.OneTime,
          pricingType: PricingTypeEnum.Flat,
          unitMetric: 'sd',
          unitDuration: UnitDurationEnum.PER_ONE_TIME,
          tiersEnabled: true,
          isEnabled: false,
        },
      ];

      const pricingModelEntities = await seedEntities(
        connection,
        OemPricingModelEntity,
        pricingModels,
      );

      return pricingModelEntities;
    }
  };
