import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeActionLogAssociationIndex1673543013741
  implements MigrationInterface
{
  name = 'removeActionLogAssociationIndex1673543013741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_action_logs_association_idx"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_association_idx" ON "oem"."oem_action_logs" ("association") `,
    );
  }
}
