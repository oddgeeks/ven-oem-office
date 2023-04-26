import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeUpdatedAtOnQuoteVendo1661793741239
  implements MigrationInterface
{
  name = 'changeUpdatedAtOnQuoteVendo1661793741239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
  }
}
