import { MigrationInterface, QueryRunner } from 'typeorm';

export class VEN1683CannotCopyAQuoteWithCustomerProducts1674852324666
  implements MigrationInterface
{
  name = 'VEN1683CannotCopyAQuoteWithCustomerProducts1674852324666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table oem.oem_quotes_customer_products drop constraint IF EXISTS "UQ_a1ba06e4a54a88e0c21fd0e3581";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table oem.oem_quotes_customer_products drop constraint IF EXISTS "UQ_a1ba06e4a54a88e0c21fd0e3581"; alter table oem.oem_quotes_customer_products add constraint "UQ_a1ba06e4a54a88e0c21fd0e3581" unique (customer_product_uuid),`,
    );
  }
}
