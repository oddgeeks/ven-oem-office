import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';
import { DB_MAIN_USERNAME as DB_USER } from '../../environments';
import { DB_MAIN_PASSWORD } from '../../environments';

/**
 *  we need to run this code from admin, and use admin permission to give privileges to our tenant user
 */
export class initPolicies1659068117562 implements MigrationInterface {
  name = 'initPolicies1659068117562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /* await queryRunner.query(`CREATE USER ${DB_USER} WITH LOGIN PASSWORD '${DB_MAIN_PASSWORD}';`); */
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" to "${DB_USER}"`,
    );
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";`,
    );
    await queryRunner.query(`GRANT USAGE ON SCHEMA oem TO "${DB_USER}";`);
    await queryRunner.query(
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA oem TO "${DB_USER}";`,
    );
    await queryRunner.query(`
      DO
      $do$
      declare
        f record;
      BEGIN
        FOR f IN
          SELECT table_name
          FROM information_schema.tables
          WHERE table_name LIKE 'oem%' AND table_name != 'oem_companies'
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON oem.%I', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I DISABLE ROW LEVEL SECURITY;', f.table_name);

          EXECUTE format('ALTER TABLE oem.%I ALTER COLUMN "company_id" SET DEFAULT current_setting($$${DB_NAME}.current_tenant$$)::int', f.table_name);

          EXECUTE format('CREATE POLICY tenant_isolation_policy ON oem.%I USING (company_id = current_setting($$${DB_NAME}.current_tenant$$)::int);', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I ENABLE ROW LEVEL SECURITY;', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I FORCE ROW LEVEL SECURITY;', f.table_name);
        END LOOP;
      END
      $do$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /* await queryRunner.query(`DROP USER ${DB_USER} WITH LOGIN PASSWORD '${DB_MAIN_PASSWORD}';`); */
    await queryRunner.query(
      `REVOKE ALL PRIVILEGES ON DATABASE "${DB_NAME}" to ${DB_USER};`,
    );
    await queryRunner.query(
      `REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO ${DB_USER};`,
    );
    await queryRunner.query(`REVOKE USAGE ON SCHEMA oem TO ${DB_USER};`);
    await queryRunner.query(
      `REVOKE USAGE, SELECT ON ALL SEQUENCES IN SCHEMA oem TO ${DB_USER};`,
    );
    await queryRunner.query(`
      DO
      $do$
      declare
        f record;
      BEGIN
        FOR f IN
          SELECT table_name
          FROM information_schema.tables
          WHERE table_name LIKE 'oem%' AND table_name != 'oem_companies'
        LOOP
          EXECUTE format('DROP POLICY tenant_isolation_policy ON oem.%I', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I DISABLE ROW LEVEL SECURITY;', f.table_name);
        END LOOP;
      END
      $do$;
    `);
  }
}
