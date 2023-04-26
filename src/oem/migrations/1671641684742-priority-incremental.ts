import { MigrationInterface, QueryRunner } from 'typeorm';

export class priorityIncremental1671641684742 implements MigrationInterface {
  name = 'priorityIncremental1671641684742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "oem"."oem_roles_priority_seq" OWNED BY "oem"."oem_roles"."priority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "priority" SET DEFAULT nextval('"oem"."oem_roles_priority_seq"')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "priority" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "oem"."oem_roles_priority_seq"`);
  }
}
