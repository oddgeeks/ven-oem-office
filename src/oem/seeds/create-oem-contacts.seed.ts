import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemContactEntity } from '../main/oem-contacts/oem-contact.entity';

export default class CreateOemContacts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemContactEntity)().create();
  }
}
