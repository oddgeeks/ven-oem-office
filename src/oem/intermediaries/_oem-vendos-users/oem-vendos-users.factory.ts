import { define } from 'typeorm-seeding';

import { VendosUsers } from './oem-vendos-users.entity';

interface Context {
  userId?: number;
  vendoId?: number;
  isOwner?: boolean;
  isApprover?: boolean;
  companyId?: number;
}

define(VendosUsers, (faker_, context: Context) => {
  const vendosUsers = new VendosUsers();

  vendosUsers.userId = context?.userId || 1;
  vendosUsers.vendoId = context?.vendoId || 1;
  vendosUsers.isOwner = context?.isOwner || true;
  vendosUsers.isApprover = context?.isApprover || true;
  vendosUsers.companyId = context?.companyId || 1;

  return vendosUsers;
});
