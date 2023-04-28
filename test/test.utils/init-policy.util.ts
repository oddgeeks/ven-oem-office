import { useRefreshDatabase } from 'typeorm-seeding';
import { DB_MAIN_DATABASE as DB_NAME } from '../../src/environments';
import { DB_MAIN_USERNAME as DB_USER } from '../../src/environments';
import { DB_MAIN_PASSWORD } from '../../src/environments';

export async function initPolicy() {
  //TODO: in some reason it doesn't fresh a db
  const connection = await useRefreshDatabase({
    root: process.cwd(),
    configName: 'orm-master.config.ts',
    connection: 'MASTER_CONNECTION_CONF',
    // typeorm-seeding bug found while checking its source code,
    // it uses configureOption.name instead of configureOption.connection in createConnection function
    name: 'MASTER_CONNECTION_CONF',
  } as any);
  // // Recreate the database using the migrations file.
  // if (connection && connection.isConnected) {
  //   await connection.dropDatabase();
  //   await connection.runMigrations();
  // }
  // init tenant
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect(); // performs connection

  console.debug('DB_MAIN_DATABASE', DB_NAME);

  await queryRunner.query(`
  DO
   $do$
    BEGIN
       IF EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE  rolname = '${DB_USER}') THEN

          RAISE NOTICE 'Role "${DB_USER}" already exists. Skipping.';
       ELSE
          CREATE ROLE "${DB_USER}" LOGIN PASSWORD '${DB_MAIN_PASSWORD}';
       END IF;
    END
   $do$;`);

  await queryRunner.manager.query(
    `GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" to "${DB_USER}";`,
  );
  await queryRunner.manager.query(
    `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";`,
  );
  await queryRunner.manager.query(`GRANT USAGE ON SCHEMA oem TO "${DB_USER}";`);
  await queryRunner.manager.query(
    `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA oem TO "${DB_USER}";`,
  );

  /*
   * We should not use EXECUTE format('ALTER TABLE oem.%I ALTER COLUMN "company_id" SET DEFAULT ''1''', f.table_name); it will broke multi tenancy tests
   *
   EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON oem.%I', f.table_name);
   EXECUTE format('ALTER TABLE oem.%I DISABLE ROW LEVEL SECURITY;', f.table_name);
   EXECUTE format('ALTER TABLE oem.%I ALTER COLUMN "company_id" SET DEFAULT ''1''', f.table_name);
   */
  await queryRunner.manager.query(`
    DO
    $do$
    declare
      f record;
    BEGIN
      FOR f IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_name LIKE 'oem%' AND table_name != 'oem_companies' AND table_name != 'oem_channels' AND table_name != 'oem_bundles_products'
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON oem.%I', f.table_name);
        EXECUTE format('ALTER TABLE oem.%I DISABLE ROW LEVEL SECURITY;', f.table_name);

        EXECUTE format('CREATE POLICY tenant_isolation_policy ON oem.%I USING (company_id = current_setting($$${DB_NAME}.current_tenant$$)::int);', f.table_name);
        EXECUTE format('ALTER TABLE oem.%I ENABLE ROW LEVEL SECURITY;', f.table_name);
        EXECUTE format('ALTER TABLE oem.%I FORCE ROW LEVEL SECURITY;', f.table_name);
      END LOOP;
    END
    $do$;
  `);

  await queryRunner.release();
}
