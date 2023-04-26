import { getConnection, getConnectionManager } from 'typeorm';
import {
  DB_MAIN_DATABASE as DB_NAME,
  DB_MAIN_USERNAME as DB_USER,
} from '../environments';

//TODO: we should not provide hardcoded connection name in utils (doesn't work like expected)
export async function resetDBMeta(connectionName = 'MASTER_CONNECTION_CONF') {
  const connection = getConnection(connectionName);

  // For some reason after resetting the data we are getting the foreign key constraint vilolation error without this
  const queryRunner = connection.createQueryRunner();

  await queryRunner.manager.query(`
    GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" to "${DB_USER}";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";
    GRANT USAGE ON SCHEMA oem TO "${DB_USER}";
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA oem TO "${DB_USER}";

    -- NOT INCLUDED in the seeds:

    INSERT INTO oem.oem_quote_and_vendo_uuids (quote_and_vendo_uuid_type, company_id, prefix, last_uuid, is_enabled, created_at, updated_at)
      VALUES ('Quote'::oem.oem_quote_and_vendo_uuids_quote_and_vendo_uuid_type_enum, 1, 'Q-', 1, true, DEFAULT, DEFAULT) ON CONFLICT DO NOTHING;
    INSERT INTO oem.oem_quote_and_vendo_uuids (quote_and_vendo_uuid_type, company_id, prefix, last_uuid, is_enabled, created_at, updated_at)
      VALUES ('Vendo'::oem.oem_quote_and_vendo_uuids_quote_and_vendo_uuid_type_enum, 1, 'V-', 1, true, DEFAULT, DEFAULT) ON CONFLICT DO NOTHING;

    DO
    $tenancy$
      DECLARE
        f record;
      BEGIN
        FOR f IN
          SELECT table_name
          FROM information_schema.tables
          WHERE table_name LIKE 'oem%' AND table_name != 'oem_companies' AND table_name != 'oem_channels'
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON oem.%I', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I DISABLE ROW LEVEL SECURITY;', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I ALTER COLUMN "company_id" SET DEFAULT current_setting($$${DB_NAME}.current_tenant$$)::int', f.table_name);

          EXECUTE format('CREATE POLICY tenant_isolation_policy ON oem.%I USING (company_id = current_setting($$${DB_NAME}.current_tenant$$)::int);', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I ENABLE ROW LEVEL SECURITY;', f.table_name);
          EXECUTE format('ALTER TABLE oem.%I FORCE ROW LEVEL SECURITY;', f.table_name);
        END LOOP;
      END
    $tenancy$;

    DO
    $parent$
      DECLARE
        f record;
        pkey text;
      BEGIN
        FOR f IN
          SELECT table_name
          FROM information_schema.tables
          WHERE table_name LIKE 'oem%'
        LOOP
          EXECUTE format(
            '
              SELECT a.attname
              FROM  pg_index i
              JOIN  pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
              WHERE i.indrelid = ''"oem"."%I"''::regclass
              AND   i.indisprimary
            ',
            f.table_name
          ) INTO pkey;

          EXECUTE format(
            '
              DO $reset_key$
                BEGIN
                  BEGIN
                    SELECT SETVAL(
                      (SELECT PG_GET_SERIAL_SEQUENCE(''"oem"."%I"'', ''%I'')),
                      (SELECT (MAX("%I")::int + 1) FROM "oem"."%I"),
                      FALSE
                    );
                  EXCEPTION
                    WHEN OTHERS THEN RETURN;
                  END;
                END;
              $reset_key$;
            ',
            f.table_name,
            pkey, pkey,
            f.table_name
          );
        END LOOP;
      END
    $parent$;
  `);
}
