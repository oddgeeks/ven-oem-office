import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateLogoUrlSizes1676225289940 implements MigrationInterface {
  name = 'updateLogoUrlSizes1676225289940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table oem.oem_company_channel_settings alter column logo_url type varchar(1024) using logo_url::varchar(1024);`,
    );
    await queryRunner.query(
      `alter table oem.oem_channels alter column logo_url type varchar(1024) using logo_url::varchar(1024);`,
    );
    await queryRunner.query(
      `alter table oem.oem_customers alter column logo_url type varchar(1024) using logo_url::varchar(1024);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
