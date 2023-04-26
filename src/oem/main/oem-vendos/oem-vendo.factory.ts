import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import * as moment from 'moment-timezone';

import { Vendo } from './oem-vendo.entity';
import { VendoStatusEnum } from './oem-vendo.enums/vendo-status.enum';

define(Vendo, () => {
  const vendo = new Vendo();

  vendo.companyId = 1;
  vendo.ownerUserId = 1;
  vendo.customerId = 1;
  vendo.geoHierarchyId = 1;
  vendo.vendoUuid = faker.datatype.uuid();
  vendo.opportunityId = faker.datatype.uuid();
  vendo.isExternal = faker.datatype.boolean();
  vendo.vendoName = faker.company.companyName();
  vendo.vendoComments = faker.lorem.slug(4);
  vendo.vendoStatus = VendoStatusEnum.DRAFT;
  vendo.isEnabled = true;
  vendo.expiresAt = moment.utc().add(3, 'months').toDate();
  vendo.isLocked = false;
  vendo.netAmount = faker.datatype.number(500);

  return vendo;
});
