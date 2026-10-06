-- Migración: pasar del esquema anterior (bolívares, con categorías, método de
-- pago, fuente y fecha límite) al esquema simplificado en dólares.
-- Ejecutar en Supabase > SQL Editor SOLO si ya habías corrido el schema viejo.
--
-- Los montos NO se convierten: si tenías datos en Bs, revísalos después.

-- Gastos: descripcion pasa a ser el nombre; se van categoria y metodo.
alter table public.gastos rename column descripcion to nombre;
alter table public.gastos drop column if exists categoria;
alter table public.gastos drop column if exists metodo;
update public.gastos set nombre = 'Gasto' where nombre = '';
alter table public.gastos alter column nombre drop default;

-- Ingresos: descripcion pasa a ser el nombre; se va fuente.
alter table public.ingresos rename column descripcion to nombre;
alter table public.ingresos drop column if exists fuente;
update public.ingresos set nombre = 'Ingreso' where nombre = '';
alter table public.ingresos alter column nombre drop default;

-- Préstamos y deudas: se van descripcion y fecha límite.
alter table public.prestamos drop column if exists descripcion;
alter table public.prestamos drop column if exists fecha_limite;
alter table public.deudas drop column if exists descripcion;
alter table public.deudas drop column if exists fecha_limite;
