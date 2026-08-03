-- Corre esto SOLO si ya ejecutaste schema.sql antes y por lo tanto la tabla
-- profiles ya existe. Si es un proyecto nuevo, ignora este archivo: ya está
-- incluido dentro de schema.sql.

alter table profiles add column if not exists estado_animo text;
alter table profiles add column if not exists tipo_apoyo text;
alter table profiles add column if not exists reto_principal text;
alter table groups add column if not exists tipo_apoyo text;
