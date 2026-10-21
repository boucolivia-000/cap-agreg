-- À exécuter une seule fois dans Supabase > SQL Editor.
create table if not exists public.cap_agreg_devices (
 user_id uuid not null references auth.users(id) on delete cascade,
 device_id text not null,
 payload jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 primary key (user_id, device_id)
);
alter table public.cap_agreg_devices enable row level security;
revoke all on public.cap_agreg_devices from anon;
grant select, insert, update, delete on public.cap_agreg_devices to authenticated;
drop policy if exists cap_agreg_owner_select on public.cap_agreg_devices;
create policy cap_agreg_owner_select on public.cap_agreg_devices for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists cap_agreg_owner_insert on public.cap_agreg_devices;
create policy cap_agreg_owner_insert on public.cap_agreg_devices for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists cap_agreg_owner_update on public.cap_agreg_devices;
create policy cap_agreg_owner_update on public.cap_agreg_devices for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists cap_agreg_owner_delete on public.cap_agreg_devices;
create policy cap_agreg_owner_delete on public.cap_agreg_devices for delete to authenticated using ((select auth.uid()) = user_id);
