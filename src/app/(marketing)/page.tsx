import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelPill } from "@/components/ui/level-pill";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS, SKILL_CODES, SKILL_LABELS } from "@/types/content";

const SKILL_DESCRIPTIONS: Record<string, string> = {
  spreken: "Oefen gesprekken uit het dagelijks leven en ontvang directe feedback.",
  luisteren: "Luister naar realistische fragmenten en beantwoord interactieve vragen.",
  lezen: "Lees e-mails, brieven en advertenties — moeilijke woorden worden direct uitgelegd.",
  schrijven: "Schrijf e-mails en formulieren en krijg feedback op grammatica en opbouw.",
  knm: "Leer hoe Nederland werkt: wonen, werken, zorg, DigiD en meer.",
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Inburgering &amp; Staatsexamen NT2
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Jouw weg naar een nieuwe toekomst
          </h1>
          <p className="mt-4 text-lg text-navy-600">
            Bereid je stap voor stap voor op Spreken, Luisteren, Lezen, Schrijven en Kennis van de
            Nederlandse Maatschappij — met eigen oefenmateriaal, directe AI-feedback en een
            persoonlijk studieplan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/registreren" size="lg">
              Start gratis
            </LinkButton>
            <LinkButton href="/login" variant="outline" size="lg">
              Ik heb al een account
            </LinkButton>
          </div>
          <p className="mt-4 text-xs text-navy-400">
            Eigen oefenmateriaal — geen gekopieerde examenvragen, geen garantie op slagen.
          </p>
        </div>
      </section>

      <section className="border-y border-navy-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900">Kies je niveau</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-navy-500">
            Van je eerste woorden Nederlands tot het Staatsexamen NT2 Programma II.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVEL_CODES.map((level) => {
              const available = AVAILABLE_LEVELS.includes(level);
              return (
                <Card key={level} className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-3">
                    <LevelPill level={level} active={available} locked={!available} />
                    {!available && (
                      <span className="text-xs font-medium text-navy-400">Binnenkort</span>
                    )}
                  </div>
                  <CardTitle className="text-base">{LEVEL_LABELS[level]}</CardTitle>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-navy-900">Alle examenonderdelen</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CODES.map((skill) => (
            <Card key={skill}>
              <CardContent className="flex flex-col gap-2">
                <CardTitle>{SKILL_LABELS[skill]}</CardTitle>
                <CardDescription>{SKILL_DESCRIPTIONS[skill]}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Elke dag een stap dichter bij je doel</h2>
          <p className="mt-3 text-navy-200">
            Na registratie stel je jouw studieplan samen: moedertaal, gewenst niveau, examendatum
            en beschikbare tijd per dag. Wij passen je leerplan automatisch aan op je voortgang.
          </p>
          <div className="mt-6">
            <LinkButton href="/registreren" size="lg">
              Begin vandaag
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
