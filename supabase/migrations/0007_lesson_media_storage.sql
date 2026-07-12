-- Storage bucket for admin-uploaded lesson images (publicly viewable, admin-only writes).
-- Reuses is_admin() from 0004_access_control.sql.

insert into storage.buckets (id, name, public)
values ('lesson-media', 'lesson-media', true)
on conflict (id) do nothing;

create policy "lesson-media is publicly readable"
on storage.objects for select
using (bucket_id = 'lesson-media');

create policy "admins upload lesson-media"
on storage.objects for insert
with check (bucket_id = 'lesson-media' and is_admin());

create policy "admins update lesson-media"
on storage.objects for update
using (bucket_id = 'lesson-media' and is_admin());

create policy "admins delete lesson-media"
on storage.objects for delete
using (bucket_id = 'lesson-media' and is_admin());
