import { define } from 'typeorm-seeding';
import { PricingModel } from './oem-pricing-model.entity';
import { faker } from '@faker-js/faker';
import { ModelTypeEnum } from './oem-pricing-model.enums/model-type.enum';
import { PricingTypeEnum } from './oem-pricing-model.enums/pricing-type.enum';
import { UnitDurationEnum } from './oem-pricing-model.enums/unit-duration.enum';

interface Context {
  companyId?: number;
  modelName?: string;
  modelType?: ModelTypeEnum;
  pricingType?: PricingTypeEnum;
  unitMetric?: string;
  unitDuration?: UnitDurationEnum;
  tiersEnabled?: boolean;
}

define(PricingModel, (faker_, context: Context) => {
  const pricingModel = new PricingModel();

  pricingModel.companyId = context?.companyId || 1;
  pricingModel.modelName = context?.modelName || faker.word.noun();
  pricingModel.modelType = context?.modelType || ModelTypeEnum.Consumption;
  pricingModel.pricingType = context?.pricingType || PricingTypeEnum.Flat;
  //pricingModel.unitMetric = UnitMetricEnum.PER_GB;
  pricingModel.unitMetric = context?.unitMetric || 'Per GB';
  pricingModel.unitDuration =
    context?.unitDuration || UnitDurationEnum.PER_CALENDAR_MONTH;
  // pricingModel.unitDuration = 'One Time';
  pricingModel.tiersEnabled = context?.tiersEnabled || true;

  return pricingModel;
});
