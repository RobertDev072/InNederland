-- Self-service onboarding is removed: the owner creates every account manually via /admin and
-- assigns the level/module there. New signups get a sensible default (A2) immediately instead of
-- an onboarding questionnaire.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, access_status, target_level, onboarding_completed)
  values (
    new.id,
    case when new.email = 'rb085@icloud.com' then 'admin' else 'user' end,
    case when new.email = 'rb085@icloud.com' then 'active' else 'pending' end,
    'A2',
    true
  );
  return new;
end;
$$;

-- Backfill any accounts stuck mid-onboarding from before this change.
update profiles
set onboarding_completed = true,
    target_level = coalesce(target_level, 'A2')
where onboarding_completed = false or target_level is null;
