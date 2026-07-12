-- Roles & manual (WhatsApp) access control.
-- New users start as role='user', access_status='pending' (free preview only).
-- The owner's email is auto-promoted to admin/active the moment they register — no manual SQL needed.

alter table profiles
  add column role text not null default 'user' check (role in ('user', 'admin')),
  add column access_status text not null default 'pending' check (access_status in ('pending', 'active', 'blocked'));

alter table lessons
  add column is_free boolean not null default false;

alter table knm_topics
  add column is_free boolean not null default false;

-- One free preview lesson per skill (the first lesson, by sort_order).
update lessons set is_free = true
where id in (
  select distinct on (skill_code) id
  from lessons
  where level_code = 'A2'
  order by skill_code, sort_order asc
);

-- One free preview KNM chapter (the first, by sort_order).
update knm_topics set is_free = true
where id = (select id from knm_topics order by sort_order asc limit 1);

-- ---------------------------------------------------------------------------
-- Admin bootstrap: replace handle_new_user() to auto-promote the owner's email
-- ---------------------------------------------------------------------------

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, access_status)
  values (
    new.id,
    case when new.email = 'rb085@icloud.com' then 'admin' else 'user' end,
    case when new.email = 'rb085@icloud.com' then 'active' else 'pending' end
  );
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- is_admin() — security definer helper, avoids recursive RLS policy checks
-- ---------------------------------------------------------------------------

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Admin RLS bypass: admins can see/manage everyone's rows, on top of the
-- existing "own rows" policies from 0001_init.sql.
-- ---------------------------------------------------------------------------

create policy "admins manage all profiles" on profiles
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all exercise attempts" on exercise_attempts
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all study plans" on study_plans
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all study plan items" on study_plan_items
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all mock exam attempts" on mock_exam_attempts
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all coach conversations" on coach_conversations
  for all using (is_admin()) with check (is_admin());

create policy "admins manage all coach messages" on coach_messages
  for all using (is_admin()) with check (is_admin());
