import { Factory, Seeder } from 'typeorm-seeding';
import { OemUserEntity } from '../main/oem-users/oem-user.entity';
import { Connection } from 'typeorm';

export default class CreateOemUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const admin = await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Demo',
      geoHierarchyId: 1,
      roleId: 1,
      lastName: 'Admin',
      notificationEmail: 'Demo_admin@vendori.com',
      ssoLoginEmail: 'Demo_admin@vendori.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Demo',
      geoHierarchyId: 1,
      roleId: 2,
      lastName: 'Sales',
      notificationEmail: 'Demo_sales@vendori.com',
      ssoLoginEmail: 'Demo_sales@vendori.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Demo',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Partner',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'Demo_partner@vendori.com',
      isExternal: true,
      isHideWelcomeText: false,
    });

    await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Oscar',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'oscar+vendori@bloodandtreasure.com',
      ssoLoginEmail: 'oscar+vendori@bloodandtreasure.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Oscar',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'SalesForce',
      notificationEmail: 'oscar@vendori.com',
      ssoLoginEmail: 'oscar@vendori.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

   /* await factory(OemUserEntity)().create({
      companyId: 1,
      firstName: 'Test',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'diggi.dust@gmail.com',
      ssoLoginEmail: 'diggi.dust@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });*/
    return admin;
  }
}
