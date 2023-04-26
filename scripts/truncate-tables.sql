DO
$do$
declare
  f record;
BEGIN
  FOR f IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name LIKE 'oem%'
  LOOP
    EXECUTE format( 'TRUNCATE TABLE oem.%I RESTART IDENTITY CASCADE;', f.table_name );
  END LOOP;
END
$do$;
