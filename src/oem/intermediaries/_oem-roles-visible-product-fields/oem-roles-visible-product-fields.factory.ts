import { define } from 'typeorm-seeding';
import { RolesVisibleProductFields } from './oem-roles-visible-product-fields.entity';

define(RolesVisibleProductFields, (context) => {
  const rolesDiscountListPrice = new RolesVisibleProductFields();
  rolesDiscountListPrice.roleId = 1;
  rolesDiscountListPrice.visibleProductFieldId = 1;
  rolesDiscountListPrice.companyId = 1;
  return rolesDiscountListPrice;
});
