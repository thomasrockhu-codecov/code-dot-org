CREATE SCHEMA analysis_pii;
GRANT ALL PRIVILEGES ON SCHEMA analysis_pii TO GROUP admin;
GRANT SELECT ON ALL TABLES IN SCHEMA analysis_pii TO GROUP reader_pii;
