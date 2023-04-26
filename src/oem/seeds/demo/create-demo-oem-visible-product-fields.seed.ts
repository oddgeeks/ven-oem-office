import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemVisibleProductFieldEntity } from '../../main/oem-visible-product-fields/oem-visible-product-field.entity';
import { ListNameEnum } from '../../main/oem-visible-product-fields/oem-visible-product-fields.enums/list-name.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemVisibleProductFields implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const visibleProductFields: Partial<OemVisibleProductFieldEntity>[] = [
        {
          companyId,
          customName: null,
          listName: ListNameEnum.GROSS_MARGIN_PERCENT,
          isEnabled: true,
        },
        {
          companyId,
          customName: null,
          listName: ListNameEnum.GROSS_MARGIN,
          isEnabled: true,
        },
        {
          companyId,
          customName: null,
          listName: ListNameEnum.RELATIVE_UPLIFT_CUSTOMER_PRICE_PERCENT,
          isEnabled: true,
        },
        {
          companyId,
          customName: null,
          listName: ListNameEnum.RELATIVE_UPLIFT_CUSTOMER_PRICE,
          isEnabled: true,
        },
        {
          companyId,
          customName: null,
          listName: ListNameEnum.RELATIVE_UPLIFT_NET_PRICE_PERCENT,
          isEnabled: true,
        },
        {
          companyId,
          customName: null,
          listName: ListNameEnum.RELATIVE_UPLIFT_NET_PRICE,
          isEnabled: true,
        },
      ];

      const visibleProductFieldEntities = await seedEntities(
        connection,
        OemVisibleProductFieldEntity,
        visibleProductFields,
      );

      return visibleProductFieldEntities;
    }
  };
