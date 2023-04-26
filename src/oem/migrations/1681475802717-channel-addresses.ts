import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelAddresses1681475802717 implements MigrationInterface {
  name = 'channelAddresses1681475802717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_channel_addresses" ("company_id" integer NOT NULL DEFAULT current_setting('oem.current_tenant')::int, "channel_id" integer NOT NULL, "address_id" integer NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_271507d90fa3591d5159242d50e" PRIMARY KEY ("channel_id", "address_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_channel_addresses_channel_id_idx" ON "oem"."oem_channel_addresses" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_channel_addresses_address_id_idx" ON "oem"."oem_channel_addresses" ("address_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_channel_addresses_company_id_idx" ON "oem"."oem_channel_addresses" ("company_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" ADD CONSTRAINT "FK_324d63e49a5ae250ca87386170e" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" ADD CONSTRAINT "FK_6ae8764510459fc4f19dcbea1a7" FOREIGN KEY ("address_id") REFERENCES "oem"."oem_addresses"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" ADD CONSTRAINT "FK_268b51d5aca666c9efc227a5b18" FOREIGN KEY ("channel_id") REFERENCES "oem"."oem_channels"("channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" DROP CONSTRAINT "FK_268b51d5aca666c9efc227a5b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" DROP CONSTRAINT "FK_6ae8764510459fc4f19dcbea1a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channel_addresses" DROP CONSTRAINT "FK_324d63e49a5ae250ca87386170e"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_channel_addresses_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_channel_addresses_address_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_channel_addresses_channel_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_channel_addresses"`);
  }
}
