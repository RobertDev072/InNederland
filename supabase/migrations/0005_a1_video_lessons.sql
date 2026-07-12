-- A1 "Luisteren" and "Spreken" modules, built from curated public YouTube videos (embedded via
-- iframe — nothing is copied/rehosted, playback happens on YouTube's own servers).
-- No comprehension questions are attached yet: nobody has reviewed/transcribed these videos, so we
-- avoid inventing quiz content about videos we haven't watched. Add multiple_choice follow-up
-- exercises later once reviewed.

-- ---------------------------------------------------------------------------
-- Luisteren A1 (6 videos)
-- ---------------------------------------------------------------------------

insert into lessons (id, level_code, skill_code, title, description, sort_order, is_free) values
  ('c1000000-0000-0000-0000-000000000001', 'A1', 'luisteren', 'Luisteroefening 1', 'Bekijk het filmpje en oefen je luistervaardigheid.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'A1', 'luisteren', 'Luisteroefening 2', 'Bekijk het filmpje en oefen je luistervaardigheid.', 2, false),
  ('c1000000-0000-0000-0000-000000000003', 'A1', 'luisteren', 'Luisteroefening 3', 'Bekijk het filmpje en oefen je luistervaardigheid.', 3, false),
  ('c1000000-0000-0000-0000-000000000004', 'A1', 'luisteren', 'Luisteroefening 4', 'Bekijk het filmpje en oefen je luistervaardigheid.', 4, false),
  ('c1000000-0000-0000-0000-000000000005', 'A1', 'luisteren', 'Luisteroefening 5', 'Bekijk het filmpje en oefen je luistervaardigheid.', 5, false),
  ('c1000000-0000-0000-0000-000000000006', 'A1', 'luisteren', 'Luisteroefening 6', 'Bekijk het filmpje en oefen je luistervaardigheid.', 6, false);

insert into exercises (lesson_id, type, prompt, content, correct_answer, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "GOxnKRefO84"}', null, 1),
  ('c1000000-0000-0000-0000-000000000002', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "piwvLt5NCm8"}', null, 1),
  ('c1000000-0000-0000-0000-000000000003', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "RbhncFH3mF0"}', null, 1),
  ('c1000000-0000-0000-0000-000000000004', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "gETdPBmtULo"}', null, 1),
  ('c1000000-0000-0000-0000-000000000005', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "sjTSxiYFc90"}', null, 1),
  ('c1000000-0000-0000-0000-000000000006', 'listening_clip', 'Bekijk het filmpje.', '{"youtubeVideoId": "HDaw49r1Wig"}', null, 1);

-- ---------------------------------------------------------------------------
-- Spreken A1 (19 videos)
-- ---------------------------------------------------------------------------

insert into lessons (id, level_code, skill_code, title, description, sort_order, is_free) values
  ('c2000000-0000-0000-0000-000000000001', 'A1', 'spreken', 'Spreekoefening 1', 'Bekijk het voorbeeld en oefen daarna hardop.', 1, true),
  ('c2000000-0000-0000-0000-000000000002', 'A1', 'spreken', 'Spreekoefening 2', 'Bekijk het voorbeeld en oefen daarna hardop.', 2, false),
  ('c2000000-0000-0000-0000-000000000003', 'A1', 'spreken', 'Spreekoefening 3', 'Bekijk het voorbeeld en oefen daarna hardop.', 3, false),
  ('c2000000-0000-0000-0000-000000000004', 'A1', 'spreken', 'Spreekoefening 4', 'Bekijk het voorbeeld en oefen daarna hardop.', 4, false),
  ('c2000000-0000-0000-0000-000000000005', 'A1', 'spreken', 'Spreekoefening 5', 'Bekijk het voorbeeld en oefen daarna hardop.', 5, false),
  ('c2000000-0000-0000-0000-000000000006', 'A1', 'spreken', 'Spreekoefening 6', 'Bekijk het voorbeeld en oefen daarna hardop.', 6, false),
  ('c2000000-0000-0000-0000-000000000007', 'A1', 'spreken', 'Spreekoefening 7', 'Bekijk het voorbeeld en oefen daarna hardop.', 7, false),
  ('c2000000-0000-0000-0000-000000000008', 'A1', 'spreken', 'Spreekoefening 8', 'Bekijk het voorbeeld en oefen daarna hardop.', 8, false),
  ('c2000000-0000-0000-0000-000000000009', 'A1', 'spreken', 'Spreekoefening 9', 'Bekijk het voorbeeld en oefen daarna hardop.', 9, false),
  ('c2000000-0000-0000-0000-000000000010', 'A1', 'spreken', 'Spreekoefening 10', 'Bekijk het voorbeeld en oefen daarna hardop.', 10, false),
  ('c2000000-0000-0000-0000-000000000011', 'A1', 'spreken', 'Spreekoefening 11', 'Bekijk het voorbeeld en oefen daarna hardop.', 11, false),
  ('c2000000-0000-0000-0000-000000000012', 'A1', 'spreken', 'Spreekoefening 12', 'Bekijk het voorbeeld en oefen daarna hardop.', 12, false),
  ('c2000000-0000-0000-0000-000000000013', 'A1', 'spreken', 'Spreekoefening 13', 'Bekijk het voorbeeld en oefen daarna hardop.', 13, false),
  ('c2000000-0000-0000-0000-000000000014', 'A1', 'spreken', 'Spreekoefening 14', 'Bekijk het voorbeeld en oefen daarna hardop.', 14, false),
  ('c2000000-0000-0000-0000-000000000015', 'A1', 'spreken', 'Spreekoefening 15', 'Bekijk het voorbeeld en oefen daarna hardop.', 15, false),
  ('c2000000-0000-0000-0000-000000000016', 'A1', 'spreken', 'Spreekoefening 16', 'Bekijk het voorbeeld en oefen daarna hardop.', 16, false),
  ('c2000000-0000-0000-0000-000000000017', 'A1', 'spreken', 'Spreekoefening 17', 'Bekijk het voorbeeld en oefen daarna hardop.', 17, false),
  ('c2000000-0000-0000-0000-000000000018', 'A1', 'spreken', 'Spreekoefening 18', 'Bekijk het voorbeeld en oefen daarna hardop.', 18, false),
  ('c2000000-0000-0000-0000-000000000019', 'A1', 'spreken', 'Spreekoefening 19', 'Bekijk het voorbeeld en oefen daarna hardop.', 19, false);

insert into exercises (lesson_id, type, prompt, content, correct_answer, sort_order) values
  ('c2000000-0000-0000-0000-000000000001', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "ieZHZoQvE_w"}', null, 1),
  ('c2000000-0000-0000-0000-000000000002', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "IwjWw5Od0fo"}', null, 1),
  ('c2000000-0000-0000-0000-000000000003', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "_eQAKEbQYLk"}', null, 1),
  ('c2000000-0000-0000-0000-000000000004', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "3dvyA5tRkiw"}', null, 1),
  ('c2000000-0000-0000-0000-000000000005', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "6zaDd9zhK9k"}', null, 1),
  ('c2000000-0000-0000-0000-000000000006', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "C6q60sF8F9U"}', null, 1),
  ('c2000000-0000-0000-0000-000000000007', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "6qqMIHO64wA"}', null, 1),
  ('c2000000-0000-0000-0000-000000000008', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "dyLBaOu9e2A"}', null, 1),
  ('c2000000-0000-0000-0000-000000000009', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "Yb3ZJCmVhhM"}', null, 1),
  ('c2000000-0000-0000-0000-000000000010', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "9yNzckuxiO4"}', null, 1),
  ('c2000000-0000-0000-0000-000000000011', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "60We20aDZGY"}', null, 1),
  ('c2000000-0000-0000-0000-000000000012', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "d-Frn9FGv80"}', null, 1),
  ('c2000000-0000-0000-0000-000000000013', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "E6aEs2ddlg8"}', null, 1),
  ('c2000000-0000-0000-0000-000000000014', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "PqXCHJjMzTg"}', null, 1),
  ('c2000000-0000-0000-0000-000000000015', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "l_qo0oTymJY"}', null, 1),
  ('c2000000-0000-0000-0000-000000000016', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "-Mre3SlHdMk"}', null, 1),
  ('c2000000-0000-0000-0000-000000000017', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "h-WCBPe88mc"}', null, 1),
  ('c2000000-0000-0000-0000-000000000018', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "gXsteFpLONg"}', null, 1),
  ('c2000000-0000-0000-0000-000000000019', 'speaking_prompt', 'Bekijk het filmpje en oefen daarna hardop na.', '{"scenario": "Bekijk het filmpje hieronder en oefen de zinnen daarna hardop na.", "youtubeVideoId": "8g22wt5N0jw"}', null, 1);
