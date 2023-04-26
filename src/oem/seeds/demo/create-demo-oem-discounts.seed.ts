import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemDiscountEntity } from '../../main/oem-discounts/oem-discount.entity';
import { DiscountTypeEnum } from '../../main/oem-discounts/oem-discount.enums/discount-type.enum';
import { ApplicableToEnum } from '../../main/oem-discounts/oem-discount.enums/applicable-to.enum';
import { PositionEnum } from '../../main/oem-discounts/oem-discount.enums/position.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemDiscounts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const discounts: Partial<OemDiscountEntity>[] = [
        {
          companyId,
          name: 'Customer Program Discount',
          priority: 1,
          discountType: DiscountTypeEnum.PROGRAM,
          applicableTo: ApplicableToEnum.CUSTOMER,
          position: PositionEnum.LIST_PRICE,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          name: 'Customer Discretionary Discount',
          priority: 2,
          discountType: DiscountTypeEnum.DISCRETIONARY,
          applicableTo: ApplicableToEnum.CUSTOMER,
          position: PositionEnum.LIST_PRICE,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          name: 'Channel Program Discount',
          priority: 3,
          discountType: DiscountTypeEnum.PROGRAM,
          applicableTo: ApplicableToEnum.CHANNEL,
          position: PositionEnum.CUSTOMER_PRICE,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          name: 'Channel Discretionary Discount',
          priority: 4,
          discountType: DiscountTypeEnum.DISCRETIONARY,
          applicableTo: ApplicableToEnum.CHANNEL,
          position: PositionEnum.CUSTOMER_PRICE,
          isEnabled: true,
          isActive: true,
        },
      ];

      const discountEntities = await seedEntities(
        connection,
        OemDiscountEntity,
        discounts,
      );

      return discountEntities;
    }
  };
