-- Reference data: levels and skills. Run after 0001_init.sql.
-- Actual lesson/exercise content lives in 0002_seed_a2_content.sql.

insert into levels (code, name, description, sort_order) values
  ('A1', 'A1 — Basis Nederlands', 'De eerste stappen in het Nederlands.', 1),
  ('A2', 'A2 — Inburgering', 'Voorbereiding op het inburgeringsexamen.', 2),
  ('B1', 'B1 — Staatsexamen NT2 Programma I', 'Voorbereiding op Staatsexamen NT2 I.', 3),
  ('B2', 'B2 — Staatsexamen NT2 Programma II', 'Voorbereiding op Staatsexamen NT2 II.', 4)
on conflict (code) do nothing;

insert into skills (code, name) values
  ('spreken', 'Spreken'),
  ('luisteren', 'Luisteren'),
  ('lezen', 'Lezen'),
  ('schrijven', 'Schrijven'),
  ('knm', 'Kennis van de Nederlandse Maatschappij')
on conflict (code) do nothing;
