# InNederland.ai

Leerplatform voor voorbereiding op het inburgeringsexamen en Staatsexamen NT2 (A1–B2): Spreken, Luisteren,
Lezen, Schrijven en Kennis van de Nederlandse Maatschappij (KNM), met AI-feedback, een persoonlijk studieplan
en proefexamens.

Gebouwd met Next.js 16 (App Router, TypeScript, Tailwind v4) en Supabase (Postgres, Auth). De AI-laag draait
volledig op gratis tiers — zie [Kosten](#kosten--gratis-tier) hieronder.

## Vereisten

- Node.js 20.9+
- Een gratis [Supabase](https://supabase.com) project
- Een gratis [Google Gemini API key](https://aistudio.google.com/apikey)

## Setup

1. Installeer dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.local.example` naar `.env.local` en vul in:

   ```bash
   cp .env.local.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project → Settings → API
   - `GEMINI_API_KEY` — Google AI Studio → Get API key
   - `LANGUAGETOOL_API_URL` — laat op de standaardwaarde (publieke gratis instantie) staan, tenzij je zelf
     LanguageTool host

3. Voer de database-migraties uit tegen je Supabase project, in volgorde, via de SQL Editor in het Supabase
   dashboard, of in één keer via `npx supabase db push --db-url "<connection-string>"`:

   ```text
   supabase/migrations/0001_init.sql               -- schema + RLS-policies
   supabase/migrations/0002_seed_reference_data.sql -- niveaus (A1–B2) en vaardigheden
   supabase/migrations/0003_seed_a2_content.sql     -- A2-lessen, oefeningen en KNM-hoofdstukken
   ```

   `supabase/seed.sql` bevat dezelfde referentiedata als `0002_seed_reference_data.sql` en wordt alleen
   gebruikt door de Supabase CLI's lokale `db reset`-workflow (met een lokale Docker-database) — voor een
   remote project via `db push` doorloop je gewoon de migraties hierboven.

4. Start de dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Projectstructuur

```text
src/
  app/
    (marketing)/      publiek — homepage
    (auth)/           login, registreren
    (dashboard)/      ingelogde omgeving: dashboard, spreken, luisteren, lezen, schrijven, knm,
                      proefexamen, coach — gedeelde layout met sidebar/niveau-navigatie
    api/ai/           route handlers die de Gemini/LanguageTool-wrappers aanroepen
  components/
    ui/               designsysteem (Button, Card, Badge, ProgressBar, LevelPill, Input, Select)
    layout/           Logo, Sidebar, MobileNav
    exercises/        herbruikbare oefen-UI (MultipleChoiceQuestion, ClickableText)
    dashboard/        StudyPlanCard, LockedLevelNotice
  lib/
    supabase/         browser- en server-clients
    ai/               gemini.ts (tekstgeneratie + streaming), languagetool.ts (grammatica)
    speech/           useSpeechRecognition / useSpeechSynthesis (browser Web Speech API)
    exercises/, study-plan/, profile/, mock-exam/, onboarding/, auth/   — data queries + server actions
  types/              content.ts (niveaus/vaardigheden), database.ts (Supabase-schema), exercise-content.ts
                      (contract voor exercises.content/correct_answer), feedback.ts (AI-feedback-shape)
supabase/
  migrations/         SQL-schema + RLS
  seed.sql            referentiedata (niveaus, vaardigheden)
src/proxy.ts          sessie-refresh + auth-gate (Next.js 16: vervangt middleware.ts)
```

## Kosten / gratis tier

Dit project is bewust gebouwd zonder betaalde AI-diensten:

- **Hosting**: Vercel Hobby (gratis) + Supabase free tier (Postgres, Auth, Storage)
- **AI-tekstfeedback** (schrijven/spreken-inhoud, woorduitleg, AI-coach): Google Gemini API, gratis tier
- **Grammatica/spelling** (Schrijven): publieke LanguageTool API, gratis, rate-limited
- **Spraak-naar-tekst** (Spreken): browser `SpeechRecognition` — gratis, geen server-kosten. Beoordeelt de
  herkende tekst, niet de uitspraak zelf.
- **Tekst-naar-spraak** (Luisteren): browser `SpeechSynthesis` — gratis, genereert audio on-the-fly

Gratis tiers zijn rate-limited; prima voor development en een eerste groep gebruikers. Bij meer verkeer is een
betaald plan nodig. De AI-laag zit achter `src/lib/ai/` zodat je later eenvoudig kan wisselen van provider.

## Scope van deze build

Alleen **A2 (Inburgering)** heeft nu echte content. A1/B1/B2 tonen "binnenkort beschikbaar" — de volledige
architectuur (database, navigatie, componenten) ondersteunt alle niveaus al, dus nieuwe content toevoegen is
een kwestie van seed-data schrijven, geen nieuwe code.
