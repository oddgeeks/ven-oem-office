import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRolesVisibleProductFields1676664589056
  implements MigrationInterface
{
  name = 'addRolesVisibleProductFields1676664589056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_roles_visible_product_fields_visible_product_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD "role_visible_product_field_id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_49376bbdd2183b28f458cac02e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_d2aad9c0e8adb3297b79b0d508f" PRIMARY KEY ("role_id", "visible_product_field_id", "role_visible_product_field_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "FK_1a553617822a3c5b98bac66f6db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "FK_60375d2ecf1c6dac99c1e771cc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_d2aad9c0e8adb3297b79b0d508f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_2d6c1d1ac0176cae4adea9811a7" PRIMARY KEY ("visible_product_field_id", "role_visible_product_field_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_2d6c1d1ac0176cae4adea9811a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_4e31a9eb49d193b9e0ed1aa040b" PRIMARY KEY ("role_visible_product_field_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "oem_roles_visible_product_fields_visible_product_id_idx" ON "oem"."oem_roles_visible_product_fields" ("role_visible_product_field_id", "role_id", "visible_product_field_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "FK_1a553617822a3c5b98bac66f6db" FOREIGN KEY ("role_id") REFERENCES "oem"."oem_roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "FK_60375d2ecf1c6dac99c1e771cc3" FOREIGN KEY ("visible_product_field_id") REFERENCES "oem"."oem_visible_product_fields"("visible_product_field_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "FK_60375d2ecf1c6dac99c1e771cc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "FK_1a553617822a3c5b98bac66f6db"`,
    );

    await queryRunner.query(
      `DROP INDEX "oem"."oem_roles_visible_product_fields_visible_product_id_idx"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_4e31a9eb49d193b9e0ed1aa040b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_2d6c1d1ac0176cae4adea9811a7" PRIMARY KEY ("visible_product_field_id", "role_visible_product_field_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_2d6c1d1ac0176cae4adea9811a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_d2aad9c0e8adb3297b79b0d508f" PRIMARY KEY ("role_id", "visible_product_field_id", "role_visible_product_field_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "FK_60375d2ecf1c6dac99c1e771cc3" FOREIGN KEY ("visible_product_field_id") REFERENCES "oem"."oem_visible_product_fields"("visible_product_field_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "FK_1a553617822a3c5b98bac66f6db" FOREIGN KEY ("role_id") REFERENCES "oem"."oem_roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP CONSTRAINT "PK_d2aad9c0e8adb3297b79b0d508f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD CONSTRAINT "PK_49376bbdd2183b28f458cac02e4" PRIMARY KEY ("role_id", "visible_product_field_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP COLUMN "role_visible_product_field_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_roles_visible_product_fields_visible_product_id_idx" ON "oem"."oem_roles_visible_product_fields" ("visible_product_field_id") `,
    );
  }
}
