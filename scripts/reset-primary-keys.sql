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