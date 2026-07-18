# InNederland.ai — openstaande punten

## Direct nodig — migraties draaien in de Supabase SQL Editor (op volgorde)

- [ ] `supabase/migrations/0007_lesson_media_storage.sql` (afbeeldingen-upload in de admin-CMS)
- [ ] `supabase/migrations/0008_lesson_rich_content.sql` (kolom voor rijke lesinhoud)
- [ ] `supabase/migrations/0009_a1_rich_content.sql` (32 originele A1-lessen: 8 onderwerpen × 4 vaardigheden,
      met intro/leerdoelen/woordenschat/grammatica/voorbeeldzinnen + tekst of man/vrouw-gesprek + vragen)

## Grotere vervolgstappen (bewust uitgesteld, in deze volgorde qua waarde)

- [ ] **AI-examencoach op eigen data** — nu geeft de coach algemene AI-antwoorden (Gemini); moet
      uitsluitend antwoorden op basis van eigen lessen/oefeningen/examenvragen/KNM-content (RAG:
      embeddings + zoeken in de eigen database, geen verzonnen info)
- [ ] **Homepage verder uitbreiden** — introductievideo, uitgebreide FAQ, animaties; reviews en
      gebruikersstatistieken pas tonen zodra er echte data is (geen nepgegevens)
- [ ] **Content gefaseerd uitbreiden** — meer lessen/oefeningen/video's per niveau en vaardigheid,
      in behapbare batches via de admin-CMS (niet alles in één keer)

## Admin-paneel secties die nu nog "binnenkort" zijn

- [ ] Statistieken (uitgebreider dan het huidige dashboard)
- [ ] Betalingen (logboek van WhatsApp-betalingen)
- [ ] Talen-beheer (vertalingen bijwerken vanuit de UI in plaats van code)
- [ ] Meldingen (nieuwe registraties, betaalverzoeken, geblokkeerde accounts)
- [ ] Logs (audit-log van admin-acties)
- [ ] Instellingen (bv. WhatsApp-nummer, standaardniveau nieuwe accounts)

## Al klaar (ter referentie, geen actie nodig)

- Platform: Spreken/Luisteren/Lezen/Schrijven/KNM/Proefexamen/AI-coach, A2 volledig + A1 Luisteren/Spreken
- Rijke-les-motor: intro/leerdoelen/woordenschat/grammatica/voorbeeldzinnen per les, klikbare
  woorduitleg, man/vrouw-gesprekken via browserstem
- A1 volledig als sjabloon: 32 originele rijke lessen (draai migratie 0009). Zelfde aanpak later voor A2/B1/B2.
- Rollen, betaal-gating via WhatsApp, admin met volledige toegang
- Admin-CMS: lessen/oefeningen/KNM/examens/gebruikers beheren
- Interface-vertaling NL/EN/PT/ES/AR/ZH (cursusinhoud blijft Nederlands)
- Moderne huisstijl, gepusht naar GitHub

## Content-bron

De originele A1-lesteksten staan als bewerkbare JSON in `supabase/content-src/a1/`. Aanpassen en opnieuw
`node supabase/content-src/assemble-a1.mjs` draaien regenereert migratie 0009. Zelfde patroon te hergebruiken
voor A2/B1/B2.
