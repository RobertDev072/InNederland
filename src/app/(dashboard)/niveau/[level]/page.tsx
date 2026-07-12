import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import {
  AVAILABLE_LEVELS,
  LEVEL_CODES,
  LEVEL_LABELS,
  SKILL_CODES,
  SKILL_LABELS,
  type LevelCode,
} from "@/types/content";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const levelCode = level.toUpperCase() as LevelCode;

  if (!LEVEL_CODES.includes(levelCode)) {
    notFound();
  }

  const available = AVAILABLE_LEVELS.includes(levelCode);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{LEVEL_LABELS[levelCode]}</h1>
        {!available ? (
          <p className="mt-1 text-navy-500">
            Dit niveau is nog in ontwikkeling. Begin alvast met A2 — Inburgering.
          </p>
        ) : null}
      </div>

      {available ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {SKILL_CODES.map((skill) => (
            <Card key={skill}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{SKILL_LABELS[skill]}</CardTitle>
                  <CardDescription>Oefeningen voor {LEVEL_LABELS[levelCode]}</CardDescription>
                </div>
                <LinkButton href={`/${skill}`} size="sm" variant="outline">
                  Start
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
