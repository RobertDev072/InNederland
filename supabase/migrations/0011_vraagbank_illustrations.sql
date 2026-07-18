-- Attach self-made SVG illustrations (in /public/illustraties) to a few clearly visual A1 reading
-- lessons from the vraagbank (migration 0010). Sample set — extend the same way for more items,
-- or upload real images per exercise via the admin CMS.

update exercises
set content = jsonb_set(content, '{imageUrl}', '"/illustraties/openingstijden.svg"')
where lesson_id = 'b0000000-0000-4000-8000-000000000001' and type = 'reading_text';

update exercises
set content = jsonb_set(content, '{imageUrl}', '"/illustraties/klok-0920.svg"')
where lesson_id = 'b0000000-0000-4000-8000-000000000003' and type = 'reading_text';

update exercises
set content = jsonb_set(content, '{imageUrl}', '"/illustraties/bus-7.svg"')
where lesson_id = 'b0000000-0000-4000-8000-000000000004' and type = 'reading_text';
