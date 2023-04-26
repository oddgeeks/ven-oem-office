import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewQuoteVendoStatus1667351371632 implements MigrationInterface {
  name = 'addNewQuoteVendoStatus1667351371632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const pendingQuoteUsers = await queryRunner.query(
      `SELECT quote_id, user_id FROM oem.oem_quotes_users WHERE approval_status = 'Pending'`,
    );
    const pendingVendoUsers = await queryRunner.query(
      `SELECT vendo_id, user_id FROM oem.oem_vendos_users WHERE approval_status = 'Pending'`,
    );
    const pendingQuotes = await queryRunner.query(
      `SELECT quote_id FROM oem.oem_quotes WHERE quote_status = 'Pending'`,
    );
    const pendingVendos = await queryRunner.query(
      `SELECT vendo_id FROM oem.oem_vendos WHERE vendo_status = 'Pending'`,
    );
    if (pendingQuoteUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes_users SET approval_status = NULL WHERE quote_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.quote_id)
          .join(',')}) AND user_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingVendoUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos_users SET approval_status = NULL WHERE vendo_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.vendo_id)
          .join(',')}) AND user_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingQuotes.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes SET quote_status = 'Draft' WHERE quote_id IN (${pendingQuotes
          .map((quote: any) => quote.quote_id)
          .join(',')})`,
      );
    }
    if (pendingVendos.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos SET vendo_status = 'Draft' WHERE vendo_id IN (${pendingVendos
          .map((vendo: any) => vendo.vendo_id)
          .join(',')})`,
      );
    }

    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendos_users_approval_status_enum" RENAME TO "oem_vendos_users_approval_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendos_users_approval_status_enum" AS ENUM('Draft', 'Pending Internal Approval', 'Auto-Approved', 'Approved', 'Pending Customer Acceptance', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "approval_status" TYPE "oem"."oem_vendos_users_approval_status_enum" USING "approval_status"::"text"::"oem"."oem_vendos_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendos_users_approval_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendos_vendo_status_enum" RENAME TO "oem_vendos_vendo_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendos_vendo_status_enum" AS ENUM('Draft', 'Pending Internal Approval', 'Auto-Approved', 'Approved', 'Pending Customer Acceptance', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" TYPE "oem"."oem_vendos_vendo_status_enum" USING "vendo_status"::"text"::"oem"."oem_vendos_vendo_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendos_vendo_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quotes_quote_status_enum" RENAME TO "oem_quotes_quote_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_quote_status_enum" AS ENUM('Draft', 'Pending Internal Approval', 'Auto-Approved', 'Approved', 'Pending Customer Acceptance', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" TYPE "oem"."oem_quotes_quote_status_enum" USING "quote_status"::"text"::"oem"."oem_quotes_quote_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_quote_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quotes_users_approval_status_enum" RENAME TO "oem_quotes_users_approval_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_users_approval_status_enum" AS ENUM('Draft', 'Pending Internal Approval', 'Auto-Approved', 'Approved', 'Pending Customer Acceptance', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "approval_status" TYPE "oem"."oem_quotes_users_approval_status_enum" USING "approval_status"::"text"::"oem"."oem_quotes_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_users_approval_status_enum_old"`,
    );

    if (pendingQuoteUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes_users SET approval_status = 'Pending Internal Approval' WHERE quote_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.quote_id)
          .join(',')}) AND user_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingVendoUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos_users SET approval_status = 'Pending Internal Approval' WHERE vendo_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.vendo_id)
          .join(',')}) AND user_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingQuotes.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes SET quote_status = 'Pending Internal Approval' WHERE quote_id IN (${pendingQuotes
          .map((quote: any) => quote.quote_id)
          .join(',')})`,
      );
    }
    if (pendingVendos.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos SET vendo_status = 'Pending Internal Approval' WHERE vendo_id IN (${pendingVendos
          .map((vendo: any) => vendo.vendo_id)
          .join(',')})`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const pendingQuoteUsers = await queryRunner.query(
      `SELECT quote_id, user_id FROM oem.oem_quotes_users WHERE approval_status = 'Pending Internal Approval'`,
    );
    const pendingVendoUsers = await queryRunner.query(
      `SELECT vendo_id, user_id FROM oem.oem_vendos_users WHERE approval_status = 'Pending Internal Approval'`,
    );
    const pendingQuotes = await queryRunner.query(
      `SELECT quote_id FROM oem.oem_quotes WHERE quote_status = 'Pending Internal Approval'`,
    );
    const pendingVendos = await queryRunner.query(
      `SELECT vendo_id FROM oem.oem_vendos WHERE vendo_status = 'Pending Internal Approval'`,
    );
    if (pendingQuoteUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes_users SET approval_status = NULL WHERE quote_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.quote_id)
          .join(',')}) AND user_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingVendoUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos_users SET approval_status = NULL WHERE vendo_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.vendo_id)
          .join(',')}) AND user_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingQuotes.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes SET quote_status = 'Draft' WHERE quote_id IN (${pendingQuotes
          .map((quote: any) => quote.quote_id)
          .join(',')})`,
      );
    }
    if (pendingVendos.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos SET vendo_status = 'Draft' WHERE vendo_id IN (${pendingVendos
          .map((vendo: any) => vendo.vendo_id)
          .join(',')})`,
      );
    }

    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_users_approval_status_enum_old" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "approval_status" TYPE "oem"."oem_quotes_users_approval_status_enum_old" USING "approval_status"::"text"::"oem"."oem_quotes_users_approval_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quotes_users_approval_status_enum_old" RENAME TO "oem_quotes_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_quote_status_enum_old" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" TYPE "oem"."oem_quotes_quote_status_enum_old" USING "quote_status"::"text"::"oem"."oem_quotes_quote_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_quotes_quote_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quotes_quote_status_enum_old" RENAME TO "oem_quotes_quote_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendos_vendo_status_enum_old" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" TYPE "oem"."oem_vendos_vendo_status_enum_old" USING "vendo_status"::"text"::"oem"."oem_vendos_vendo_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_vendos_vendo_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendos_vendo_status_enum_old" RENAME TO "oem_vendos_vendo_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendos_users_approval_status_enum_old" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "approval_status" TYPE "oem"."oem_vendos_users_approval_status_enum_old" USING "approval_status"::"text"::"oem"."oem_vendos_users_approval_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendos_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendos_users_approval_status_enum_old" RENAME TO "oem_vendos_users_approval_status_enum"`,
    );

    if (pendingQuoteUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes_users SET approval_status = 'Pending' WHERE quote_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.quote_id)
          .join(',')}) AND user_id IN (${pendingQuoteUsers
          .map((quoteUser: any) => quoteUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingVendoUsers.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos_users SET approval_status = 'Pending' WHERE vendo_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.vendo_id)
          .join(',')}) AND user_id IN (${pendingVendoUsers
          .map((vendoUser: any) => vendoUser.user_id)
          .join(',')})`,
      );
    }
    if (pendingQuotes.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_quotes SET quote_status = 'Pending' WHERE quote_id IN (${pendingQuotes
          .map((quote: any) => quote.quote_id)
          .join(',')})`,
      );
    }
    if (pendingVendos.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_vendos SET vendo_status = 'Pending' WHERE vendo_id IN (${pendingVendos
          .map((vendo: any) => vendo.vendo_id)
          .join(',')})`,
      );
    }
  }
}
