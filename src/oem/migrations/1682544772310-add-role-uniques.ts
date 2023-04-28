import { MigrationInterface, QueryRunner } from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class addRoleUniques1682544772310 implements MigrationInterface {
  name = 'addRoleUniques1682544772310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_roles_role_name_idx" ON "oem"."oem_roles" ("company_id", "role_name") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_roles_role_name_idx"`);

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
