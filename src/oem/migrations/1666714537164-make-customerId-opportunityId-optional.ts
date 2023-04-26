import { MigrationInterface, QueryRunner } from 'typeorm';

export class makeCustomerIdOpportunityIdOptional1666714537164
  implements MigrationInterface
{
  name = 'makeCustomerIdOpportunityIdOptional1666714537164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP CONSTRAINT "FK_4b86f6d79958bb8a175a13c9bc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "customer_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_c67dd4067709601b07b423648f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "customer_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD CONSTRAINT "FK_4b86f6d79958bb8a175a13c9bc3" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_c67dd4067709601b07b423648f1" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_c67dd4067709601b07b423648f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP CONSTRAINT "FK_4b86f6d79958bb8a175a13c9bc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "customer_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_c67dd4067709601b07b423648f1" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "customer_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD CONSTRAINT "FK_4b86f6d79958bb8a175a13c9bc3" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
