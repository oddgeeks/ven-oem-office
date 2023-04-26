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
      EXECUTE format('ALTER TABLE oem.%I ALTER COLUMN "company_id" SET DEFAULT current_setting($$dsoemgjhiuy687.current_tenant$$)::int', f.table_name);

      EXECUTE format('CREATE POLICY tenant_isolation_policy ON oem.%I USING (company_id = current_setting($$dsoemgjhiuy687.current_tenant$$)::int);', f.table_name);
      EXECUTE format('ALTER TABLE oem.%I ENABLE ROW LEVEL SECURITY;', f.table_name);
      EXECUTE format('ALTER TABLE oem.%I FORCE ROW LEVEL SECURITY;', f.table_name);
    END LOOP;
  END
$tenancy$;
