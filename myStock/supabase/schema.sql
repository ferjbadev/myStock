-- Esquema de la app de control de gastos (montos en dólares).
-- Instalación nueva: ejecutar completo en Supabase > SQL Editor > New query > Run.
-- Si ya habías corrido la versión anterior (en bolívares, con categorías),
-- usa supabase/migracion_dolares.sql en vez de este archivo.

-- ---------------------------------------------------------------------------
-- Gastos
-- ---------------------------------------------------------------------------
create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  monto numeric(14, 2) not null check (monto > 0),
  fecha date not null default current_date,
  creado_en timestamptz not null default now()
);

create index if not exists gastos_fecha_idx on public.gastos (fecha desc);

-- ---------------------------------------------------------------------------
-- Ingresos
-- ---------------------------------------------------------------------------
create table if not exists public.ingresos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  monto numeric(14, 2) not null check (monto > 0),
  fecha date not null default current_date,
  creado_en timestamptz not null default now()
);

create index if not exists ingresos_fecha_idx on public.ingresos (fecha desc);

-- ---------------------------------------------------------------------------
-- Préstamos: dinero que YO presté y me deben devolver.
-- ---------------------------------------------------------------------------
create table if not exists public.prestamos (
  id uuid primary key default gen_random_uuid(),
  persona text not null,
  monto numeric(14, 2) not null check (monto > 0),
  monto_pagado numeric(14, 2) not null default 0 check (monto_pagado >= 0),
  fecha date not null default current_date,
  creado_en timestamptz not null default now(),
  constraint prestamos_pagado_valido check (monto_pagado <= monto)
);

-- ---------------------------------------------------------------------------
-- Deudas: dinero que YO debo pagar.
-- ---------------------------------------------------------------------------
create table if not exists public.deudas (
  id uuid primary key default gen_random_uuid(),
  acreedor text not null,
  monto numeric(14, 2) not null check (monto > 0),
  monto_pagado numeric(14, 2) not null default 0 check (monto_pagado >= 0),
  fecha date not null default current_date,
  creado_en timestamptz not null default now(),
  constraint deudas_pagado_valido check (monto_pagado <= monto)
);

-- ---------------------------------------------------------------------------
-- Cierres diarios: consolidado de cada ciclo de 24 h ya terminado.
-- La app cierra automáticamente los días pendientes al abrirse.
-- ---------------------------------------------------------------------------
create table if not exists public.cierres_diarios (
  fecha date primary key,
  total_gastos numeric(14, 2) not null default 0,
  total_ingresos numeric(14, 2) not null default 0,
  cantidad_gastos integer not null default 0,
  cantidad_ingresos integer not null default 0,
  saldo numeric(14, 2) generated always as (total_ingresos - total_gastos) stored,
  cerrado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Acceso.
-- ATENCIÓN: la app no tiene login, así que la clave anónima (visible en el
-- navegador) necesita permiso total. Cualquiera con esa clave puede leer y
-- escribir estos datos. Si más adelante quieres cerrarlo, activamos Supabase
-- Auth y cambiamos estas políticas por `auth.uid() = usuario_id`.
-- ---------------------------------------------------------------------------
alter table public.gastos enable row level security;
alter table public.ingresos enable row level security;
alter table public.prestamos enable row level security;
alter table public.deudas enable row level security;
alter table public.cierres_diarios enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['gastos', 'ingresos', 'prestamos', 'deudas', 'cierres_diarios']
  loop
    execute format('drop policy if exists acceso_anonimo on public.%I', t);
    execute format(
      'create policy acceso_anonimo on public.%I for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end
$$;
