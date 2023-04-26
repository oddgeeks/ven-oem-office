import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';
import { DB_MAIN_USERNAME as DB_USER } from '../../environments';

export class createCustomerAddresses1665025567616
  implements MigrationInterface
{
  name = 'createCustomerAddresses1665025567616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_customer_addresses" ("company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "customer_id" integer NOT NULL, "address_id" integer NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aa2ab3bace082323b2a658409b5" PRIMARY KEY ("customer_id", "address_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_customer_addresses_customer_id_idx" ON "oem"."oem_customer_addresses" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_customer_addresses_address_id_idx" ON "oem"."oem_customer_addresses" ("address_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_customer_addresses_company_id_idx" ON "oem"."oem_customer_addresses" ("company_id") `,
    );
    const customers = await queryRunner.query(
      `SELECT * FROM "oem"."oem_customers" WHERE address_id IS NOT NULL`,
    );
    for (const customer of customers) {
      await queryRunner.query(
        `INSERT INTO "oem"."oem_customer_addresses"(company_id, customer_id, address_id) VALUES(${customer.company_id}, ${customer.customer_id}, ${customer.address_id})`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" DROP CONSTRAINT "PK_63a05c826ae444e897c81f77071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ADD CONSTRAINT "PK_74b1e942676c19ed32b780326ff" PRIMARY KEY ("customer_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" DROP COLUMN "address_id"`,
    );
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_fc71632334333ce59b620a8dca7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_25f5d9f8dd9ee3abc3d83a21a5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ADD "address_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" DROP CONSTRAINT "PK_74b1e942676c19ed32b780326ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ADD CONSTRAINT "PK_63a05c826ae444e897c81f77071" PRIMARY KEY ("customer_id", "address_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_customer_addresses_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_customer_addresses_address_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_customer_addresses_customer_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_customer_addresses"`);
    await queryRunner.query(
      `CREATE INDEX "oem_customers_address_id_idx" ON "oem"."oem_customers" ("address_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ADD CONSTRAINT "FK_91ad5529f1752e874a3784dff89" FOREIGN KEY ("address_id") REFERENCES "oem"."oem_addresses"("address_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
