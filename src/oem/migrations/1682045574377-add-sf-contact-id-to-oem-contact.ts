import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfContactIdToOemContact1682045574377
  implements MigrationInterface
{
  name = 'addSfContactIdToOemContact1682045574377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ADD "sf_contact_id" character varying(36)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" DROP COLUMN "sf_contact_id"`,
    );
  }
}
