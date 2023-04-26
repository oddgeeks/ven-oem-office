import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemVisibleProductFieldEntity } from '../main/oem-visible-product-fields/oem-visible-product-field.entity';
import { ListNameEnum } from '../main/oem-visible-product-fields/oem-visible-product-fields.enums/list-name.enum';

export default class CreateOemVisibleProductFields implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const LIST_NAME = Object.keys(ListNameEnum);
    const visibleProductFields: OemVisibleProductFieldEntity[] = [];

    for (let i = 0; i < LIST_NAME.length; i++) {
      const visibleProductField = await factory(OemVisibleProductFieldEntity)({
        visibleProductFieldId: i + 1,
      }).create({
        companyId: 1,
        customName: null,
        listName: ListNameEnum[LIST_NAME[i]],
      });
      visibleProductFields.push(visibleProductField);
    }

    return visibleProductFields;
  }
}
