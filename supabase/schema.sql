-- Esquema base para Org Negocios en Supabase
-- Ejecutar en el SQL Editor de Supabase

create table if not exists usuarios (
  id bigint generated always as identity primary key,
  usuario text not null unique,
  password text not null,
  nombre text not null,
  apellido text not null,
  created_at timestamptz not null default now()
);

create table if not exists stock (
  id bigint generated always as identity primary key,
  id_usuario bigint not null references usuarios(id) on delete cascade,
  nombre text not null,
  cantidad integer not null default 0,
  precio numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pagos (
  id bigint generated always as identity primary key,
  id_usuario bigint not null references usuarios(id) on delete cascade,
  cliente text not null,
  monto numeric(12, 2) not null default 0,
  fecha date not null,
  created_at timestamptz not null default now()
);

create table if not exists clientes (
  id bigint generated always as identity primary key,
  id_usuario bigint not null references usuarios(id) on delete cascade,
  nombre text not null,
  telefono text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- Datos de prueba (credenciales case sensitive)
insert into usuarios (usuario, password, nombre, apellido) values
  ('admin', 'Admin123', 'Ana', 'Garcia'),
  ('maria', 'Maria456', 'Maria', 'Lopez'),
  ('carlos', 'Carlos789', 'Carlos', 'Rodriguez');

insert into stock (id_usuario, nombre, cantidad, precio) values
  (1, 'Monitor LED 24', 15, 89900),
  (1, 'Teclado mecanico', 32, 45000),
  (2, 'Mouse inalambrico', 48, 12500),
  (2, 'Webcam HD', 10, 32000),
  (3, 'Auriculares bluetooth', 22, 28000);

insert into pagos (id_usuario, cliente, monto, fecha) values
  (1, 'Maximiliano Perez', 15000, '2026-07-01'),
  (1, 'Laura Fernandez', 28500, '2026-07-05'),
  (2, 'Roberto Diaz', 9200, '2026-07-10'),
  (2, 'Maxi Soto', 45000, '2026-07-15'),
  (3, 'Silvia Torres', 17800, '2026-07-20');

insert into clientes (id_usuario, nombre, telefono, email) values
  (1, 'Maximiliano Perez', '11-5555-0101', 'maxi.perez@mail.com'),
  (1, 'Laura Fernandez', '11-5555-0202', 'laura.fernandez@mail.com'),
  (2, 'Maxi Soto', '11-5555-0303', 'maxi.soto@mail.com'),
  (2, 'Roberto Diaz', '11-5555-0404', 'roberto.diaz@mail.com'),
  (3, 'Silvia Torres', '11-5555-0505', 'silvia.torres@mail.com');
