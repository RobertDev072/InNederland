-- InNederland.ai — A2 content seed
-- Applied after 0001_init.sql (schema) and seed.sql (levels/skills reference rows).
-- Inserts lessons + exercises for level A2 across spreken/luisteren/lezen/schrijven,
-- three knm_topics rows, and one mock_exams row.
--
-- All Dutch texts below are ORIGINAL A2-level content written for this product —
-- none of it is copied from real official inburgering/NT2 exam material.
--
-- lessons.id and knm_topics.id use fixed literal UUIDs so the exercises/knm inserts
-- further down can reference them directly without CTEs. exercises.id and
-- mock_exams.id use gen_random_uuid() since nothing else needs to reference them.

-- ---------------------------------------------------------------------------
-- Lessons (A2) — 2 per skill for spreken, luisteren, lezen, schrijven
-- ---------------------------------------------------------------------------

insert into lessons (id, level_code, skill_code, title, description, sort_order) values
  ('a1111111-1111-1111-1111-111111111101', 'A2', 'spreken', 'Kennismaken',
   'Oefen een gesprek waarin je jezelf voorstelt aan een nieuwe buur of buurvrouw.', 1),
  ('a1111111-1111-1111-1111-111111111102', 'A2', 'spreken', 'Een afspraak maken bij de huisarts',
   'Oefen een telefoongesprek waarin je een afspraak maakt en je klachten beschrijft.', 2),
  ('a1111111-1111-1111-1111-111111111103', 'A2', 'luisteren', 'Een telefoongesprek',
   'Luister naar een telefoongesprek tussen een patiënt en een tandartspraktijk.', 1),
  ('a1111111-1111-1111-1111-111111111104', 'A2', 'luisteren', 'Een omroepbericht op het station',
   'Luister naar een omroepbericht over een gewijzigd spoor en vertraging.', 2),
  ('a1111111-1111-1111-1111-111111111105', 'A2', 'lezen', 'Een e-mail van de gemeente',
   'Lees een e-mail van de gemeente over het ophalen van een paspoort.', 1),
  ('a1111111-1111-1111-1111-111111111106', 'A2', 'lezen', 'Een advertentie voor een woning',
   'Lees een advertentie voor een huurappartement in Utrecht.', 2),
  ('a1111111-1111-1111-1111-111111111107', 'A2', 'schrijven', 'Een e-mail schrijven naar de gemeente',
   'Schrijf een e-mail om een afspraak bij de gemeente te verzetten.', 1),
  ('a1111111-1111-1111-1111-111111111108', 'A2', 'schrijven', 'Een kort bericht aan een collega',
   'Schrijf een kort bericht aan een collega om te zeggen dat je ziek bent.', 2);

-- ---------------------------------------------------------------------------
-- Lezen 1 — Een e-mail van de gemeente
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111105', 'reading_text',
   'Lees de e-mail van de gemeente en beantwoord daarna de vragen.',
   '{"text": "Beste mevrouw Jansen,\n\nWij hebben uw aanvraag voor een nieuw paspoort ontvangen. U kunt uw paspoort ophalen bij het stadhuis. Neem uw oude paspoort en een geldig legitimatiebewijs mee.\n\nDe openingstijden van het stadhuis zijn van maandag tot en met vrijdag, van 9.00 tot 17.00 uur. Op donderdag is het stadhuis ook open tot 20.00 uur.\n\nLet op: u moet eerst een afspraak maken via onze website. Zonder afspraak kunnen wij u helaas niet helpen.\n\nHeeft u vragen? Bel dan naar 14020, van maandag tot en met vrijdag.\n\nMet vriendelijke groet,\nGemeente Amsterdam"}'::jsonb,
   null, 1),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111105', 'multiple_choice',
   'Wat moet mevrouw Jansen meenemen als ze haar paspoort ophaalt?',
   '{"question": "Wat moet mevrouw Jansen meenemen als ze haar paspoort ophaalt?", "options": ["Alleen haar oude paspoort", "Haar oude paspoort en een geldig legitimatiebewijs", "Alleen een pasfoto", "Niets, want de gemeente heeft alles al"]}'::jsonb,
   '{"correctIndex": 1, "explanation": "In de e-mail staat dat mevrouw Jansen haar oude paspoort en een geldig legitimatiebewijs moet meenemen."}'::jsonb,
   2),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111105', 'multiple_choice',
   'Op welke dag is het stadhuis tot 20.00 uur open?',
   '{"question": "Op welke dag is het stadhuis tot 20.00 uur open?", "options": ["Maandag", "Woensdag", "Donderdag", "Zaterdag"]}'::jsonb,
   '{"correctIndex": 2, "explanation": "De e-mail zegt dat het stadhuis op donderdag ook open is tot 20.00 uur."}'::jsonb,
   3);

-- ---------------------------------------------------------------------------
-- Lezen 2 — Een advertentie voor een woning
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111106', 'reading_text',
   'Lees de advertentie voor de woning en beantwoord daarna de vragen.',
   '{"text": "Te huur: gezellig appartement in Utrecht centrum. Het appartement heeft twee slaapkamers, een woonkamer met balkon en een moderne keuken. De huur is 950 euro per maand, inclusief water en verwarming. Internet en gas zijn niet inbegrepen. Er is een fietsenstalling in de kelder, maar geen parkeerplaats voor de auto. Huisdieren zijn helaas niet toegestaan. Het appartement is per 1 augustus beschikbaar. Bent u geïnteresseerd? Stuur dan een e-mail met uw naam, beroep en een korte introductie naar verhuurder@voorbeeldmail.nl. Bezichtigingen zijn mogelijk op afspraak, elke zaterdag tussen 10.00 en 13.00 uur."}'::jsonb,
   null, 1),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111106', 'multiple_choice',
   'Wat is niet inbegrepen in de huurprijs?',
   '{"question": "Wat is niet inbegrepen in de huurprijs?", "options": ["Water", "Verwarming", "Internet en gas", "De fietsenstalling"]}'::jsonb,
   '{"correctIndex": 2, "explanation": "In de advertentie staat dat internet en gas niet zijn inbegrepen in de huurprijs."}'::jsonb,
   2),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111106', 'multiple_choice',
   'Wanneer kunnen geïnteresseerden het appartement bezichtigen?',
   '{"question": "Wanneer kunnen geïnteresseerden het appartement bezichtigen?", "options": ["Elke dag tussen 9.00 en 17.00 uur", "Op afspraak, elke zaterdag tussen 10.00 en 13.00 uur", "Alleen in de avond", "Alleen via de telefoon"]}'::jsonb,
   '{"correctIndex": 1, "explanation": "De advertentie zegt dat bezichtigingen op afspraak mogelijk zijn, elke zaterdag tussen 10.00 en 13.00 uur."}'::jsonb,
   3);

-- ---------------------------------------------------------------------------
-- Luisteren 1 — Een telefoongesprek
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111103', 'listening_clip',
   'Luister naar het telefoongesprek en beantwoord daarna de vragen.',
   '{"script": "Sanne, tandartspraktijk: Goedemorgen, met tandartspraktijk Van Dijk, u spreekt met Sanne. Ahmed: Goedemorgen, met Ahmed Yilmaz. Ik heb kiespijn en ik wil graag een afspraak maken. Sanne: Wat vervelend voor u. Kunt u morgenochtend om half tien? Ahmed: Ja, dat komt goed uit. Sanne: Mag ik uw geboortedatum en uw verzekering weten? Ahmed: Natuurlijk, mijn geboortedatum is 3 mei negentienhonderdvijfentachtig en ik ben verzekerd bij Zilveren Kruis. Sanne: Dank u wel. Tot morgen om half tien, meneer Yilmaz. Ahmed: Tot morgen, fijne dag nog."}'::jsonb,
   null, 1),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111103', 'multiple_choice',
   'Waarom belt Ahmed naar de tandartspraktijk?',
   '{"question": "Waarom belt Ahmed naar de tandartspraktijk?", "options": ["Hij heeft kiespijn", "Hij wil zijn afspraak afzeggen", "Hij is zijn verzekeringspas kwijt", "Hij wil weten wat de kosten zijn"]}'::jsonb,
   '{"correctIndex": 0, "explanation": "Ahmed vertelt dat hij kiespijn heeft en daarom een afspraak wil maken."}'::jsonb,
   2),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111103', 'multiple_choice',
   'Hoe laat is de afspraak?',
   '{"question": "Hoe laat is de afspraak?", "options": ["Om negen uur", "Om half tien", "Om tien uur", "Om half elf"]}'::jsonb,
   '{"correctIndex": 1, "explanation": "Sanne stelt voor om morgenochtend om half tien af te spreken en Ahmed gaat akkoord."}'::jsonb,
   3);

-- ---------------------------------------------------------------------------
-- Luisteren 2 — Een omroepbericht op het station
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111104', 'listening_clip',
   'Luister naar het omroepbericht en beantwoord daarna de vragen.',
   '{"script": "Attentie, reizigers. De trein van 14.32 uur naar Rotterdam Centraal vertrekt vandaag van spoor 5 in plaats van spoor 3. Reizigers voor Rotterdam wordt gevraagd om naar spoor 5 te lopen. Let op: de trein heeft ongeveer tien minuten vertraging vanwege werkzaamheden aan het spoor. Wij bieden onze excuses aan voor het ongemak. Voor actuele reisinformatie kunt u de NS-app raadplegen of kijken op de informatieborden boven het perron."}'::jsonb,
   null, 1),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111104', 'multiple_choice',
   'Van welk spoor vertrekt de trein naar Rotterdam?',
   '{"question": "Van welk spoor vertrekt de trein naar Rotterdam?", "options": ["Spoor 3", "Spoor 4", "Spoor 5", "Spoor 6"]}'::jsonb,
   '{"correctIndex": 2, "explanation": "De trein vertrekt van spoor 5 in plaats van spoor 3."}'::jsonb,
   2),
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111104', 'multiple_choice',
   'Waarom heeft de trein vertraging?',
   '{"question": "Waarom heeft de trein vertraging?", "options": ["Door een storing in de trein", "Door werkzaamheden aan het spoor", "Door slecht weer", "Door een ongeluk op het spoor"]}'::jsonb,
   '{"correctIndex": 1, "explanation": "In het bericht wordt gezegd dat de vertraging komt door werkzaamheden aan het spoor."}'::jsonb,
   3);

-- ---------------------------------------------------------------------------
-- Schrijven 1 — Een e-mail schrijven naar de gemeente
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111107', 'writing_task',
   'Schrijf een e-mail om je afspraak bij de gemeente te verzetten.',
   '{"instructions": "Je hebt een afspraak bij de gemeente, maar je kunt niet komen op die dag. Schrijf een e-mail naar de gemeente. Vertel waarom je de afspraak wilt verzetten en stel een nieuwe datum voor. Vergeet niet je naam en je afspraaknummer te noemen.", "minWords": 40}'::jsonb,
   null, 1);

-- ---------------------------------------------------------------------------
-- Schrijven 2 — Een kort bericht aan een collega
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111108', 'writing_task',
   'Schrijf een kort bericht aan een collega om te zeggen dat je ziek bent.',
   '{"instructions": "Je bent ziek en kunt vandaag niet werken. Schrijf een kort bericht aan je collega. Vertel dat je ziek bent, tot wanneer je denkt dat je thuisblijft en vraag of je collega een taak van je kan overnemen.", "minWords": 40}'::jsonb,
   null, 1);

-- ---------------------------------------------------------------------------
-- Spreken 1 — Kennismaken
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111101', 'speaking_prompt',
   'Stel jezelf voor aan je nieuwe buurman of buurvrouw.',
   '{"scenario": "Je ontmoet een nieuwe buurman of buurvrouw voor het eerst. Stel jezelf voor: vertel je naam, waar je vandaan komt, wat je werk of studie is en waarom je in Nederland woont.", "expectedPoints": ["Je naam noemen", "Vertellen waar je vandaan komt", "Vertellen wat je werk of studie is", "Vertellen waarom je in Nederland woont"]}'::jsonb,
   null, 1);

-- ---------------------------------------------------------------------------
-- Spreken 2 — Een afspraak maken bij de huisarts
-- ---------------------------------------------------------------------------

insert into exercises (id, lesson_id, type, prompt, content, correct_answer, sort_order) values
  (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111102', 'speaking_prompt',
   'Bel de huisarts en maak een afspraak.',
   '{"scenario": "Je belt de huisarts. Maak een afspraak en vertel kort wat je klachten zijn.", "expectedPoints": ["Jezelf voorstellen", "De klacht kort beschrijven", "Een dag en tijd voorstellen", "Vragen of de afspraak bevestigd is"]}'::jsonb,
   null, 1);

-- ---------------------------------------------------------------------------
-- KNM topics (Kennis van de Nederlandse Maatschappij)
-- ---------------------------------------------------------------------------

insert into knm_topics (id, category, title, content, sort_order) values
  ('b2222222-2222-2222-2222-222222222201', 'Wonen', 'Een huis of appartement huren in Nederland',
   '{"sections": [{"heading": "Een huurcontract", "body": "Als je een woning huurt, teken je een huurcontract met de verhuurder. In het contract staan afspraken over de huurprijs, de huurtermijn en de opzegtermijn. Lees het contract altijd goed voordat je het ondertekent."}, {"heading": "Huurtoeslag", "body": "Heb je een laag inkomen en een huurwoning met een redelijke huurprijs? Dan kun je misschien huurtoeslag aanvragen bij de Belastingdienst. Dit is een bijdrage van de overheid in de huurkosten."}, {"heading": "Rechten en plichten van huurders", "body": "Als huurder heb je recht op een veilige en goed onderhouden woning. Grote reparaties zijn meestal de verantwoordelijkheid van de verhuurder. Zelf moet je kleine reparaties, zoals een kapotte deurklink, meestal betalen."}], "checkQuestions": [{"question": "Waar kun je huurtoeslag aanvragen?", "options": ["Bij de gemeente", "Bij de Belastingdienst", "Bij de verhuurder", "Bij de bank"], "correctIndex": 1}, {"question": "Wie is meestal verantwoordelijk voor grote reparaties aan een huurwoning?", "options": ["De huurder", "De buren", "De verhuurder", "De gemeente"], "correctIndex": 2}]}'::jsonb,
   1),
  ('b2222222-2222-2222-2222-222222222202', 'Openbaar vervoer', 'Reizen met bus, tram en trein',
   '{"sections": [{"heading": "De OV-chipkaart", "body": "In Nederland reis je met het openbaar vervoer meestal met een OV-chipkaart. Je checkt in bij het instappen en checkt uit bij het uitstappen. Vergeet je uit te checken, dan betaal je een boete."}, {"heading": "Kaartjes kopen", "body": "Je kunt een OV-chipkaart kopen en opladen bij automaten op het station of via een app. Voor één rit kun je ook een los kaartje kopen, maar dat is meestal duurder."}, {"heading": "Reisregels", "body": "In bus en trein is het niet toegestaan om te roken of met je voeten op de stoel te zitten. Praat niet te hard aan de telefoon, zodat andere reizigers geen last van je hebben."}], "checkQuestions": [{"question": "Wat moet je doen als je met de OV-chipkaart reist?", "options": ["Alleen inchecken", "Alleen uitchecken", "Inchecken en uitchecken", "Niets, de kaart werkt automatisch"], "correctIndex": 2}, {"question": "Wat gebeurt er als je vergeet uit te checken?", "options": ["Je krijgt geld terug", "Je betaalt een boete", "Je kaart wordt geblokkeerd", "Er gebeurt niets"], "correctIndex": 1}]}'::jsonb,
   2),
  ('b2222222-2222-2222-2222-222222222203', 'DigiD & Belastingdienst', 'Digitaal zaken regelen met de overheid',
   '{"sections": [{"heading": "Wat is DigiD?", "body": "DigiD is jouw persoonlijke inlogcode voor de Nederlandse overheid. Met DigiD kun je veilig inloggen bij bijvoorbeeld de Belastingdienst, je gemeente en je zorgverzekeraar. Vraag je DigiD aan via de website van DigiD."}, {"heading": "Belastingaangifte", "body": "Elk jaar moet je in Nederland belastingaangifte doen bij de Belastingdienst. Dit doe je meestal tussen 1 maart en 1 mei. Met DigiD log je in op Mijn Belastingdienst om je aangifte in te vullen."}, {"heading": "Toeslagen aanvragen", "body": "Via de Belastingdienst kun je ook toeslagen aanvragen, zoals huurtoeslag, zorgtoeslag en kindgebonden budget. Dit zijn bijdragen van de overheid als je inkomen niet zo hoog is."}], "checkQuestions": [{"question": "Waarvoor gebruik je jouw DigiD?", "options": ["Alleen om te internetbankieren", "Om veilig in te loggen bij de overheid", "Om een huis te kopen", "Om een auto te verzekeren"], "correctIndex": 1}, {"question": "In welke periode doe je meestal belastingaangifte?", "options": ["Tussen 1 januari en 1 februari", "Tussen 1 maart en 1 mei", "Tussen 1 juni en 1 juli", "Tussen 1 oktober en 1 november"], "correctIndex": 1}]}'::jsonb,
   3);

-- ---------------------------------------------------------------------------
-- Mock exam (A2)
-- ---------------------------------------------------------------------------

insert into mock_exams (id, level_code, title, structure) values
  (gen_random_uuid(), 'A2', 'Proefexamen A2 — Inburgering',
   '{"sections": [{"skill": "lezen", "exerciseCount": 2}, {"skill": "luisteren", "exerciseCount": 2}, {"skill": "schrijven", "exerciseCount": 1}, {"skill": "spreken", "exerciseCount": 1}]}'::jsonb);
