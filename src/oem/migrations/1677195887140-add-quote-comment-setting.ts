import { MigrationInterface, QueryRunner } from 'typeorm';

export class addQuoteCommentSetting1677195887140 implements MigrationInterface {
  name = 'addQuoteCommentSetting1677195887140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "oem"."oem_quotes" ADD "quote_comment_settings" jsonb NOT NULL DEFAULT '{}'
    `);

    // "quoteDefaultComment": "This Quote is Valid Until {{expiresAt}}. “Pending” quotes require internal review before approval.",
    // "consumptionMessage": "Quoted consumption offerings do not reflect contractually agreed upon delivery or invoice schedules. Displayed pricing is reflective of implied consumption rates and may change depending on product pricing."
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "quote_comment_settings"`,
    );
  }
}
