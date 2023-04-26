import { define } from 'typeorm-seeding';
import { VisibleProductField } from './oem-visible-product-field.entity';
import { faker } from '@faker-js/faker';
import { ListNameEnum } from './oem-visible-product-fields.enums/list-name.enum';

interface Context {
  visibleProductFieldId?: number;
}

define(VisibleProductField, (faker_, context: Context) => {
  const LIST_NAME = Object.keys(ListNameEnum);
  const visibleProductField = new VisibleProductField();
  visibleProductField.visibleProductFieldId =
    context?.visibleProductFieldId || 1;
  visibleProductField.companyId = 1;
  visibleProductField.customName = faker.word.noun();
  visibleProductField.listName =
    ListNameEnum[LIST_NAME[Math.floor(Math.random() * LIST_NAME.length)]];
  return visibleProductField;
});
