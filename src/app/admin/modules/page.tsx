import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS, SKILL_CODES, SKILL_LABELS } from "@/types/content";

export default async function AdminModulesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("lessons").select("level_code, skill_code");
  const lessons = data ?? [];

  const countFor = (level: string, skill: string) =>
    lessons.filter((lesson) => lesson.level_code === level && lesson.skill_code === skill).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Modules &amp; Niveaus</h1>
        <p className="text-navy-500">
          Aantal lessen per niveau/vaardigheid. Ga naar{" "}
          <Link href="/admin/lessen" className="text-orange-600 hover:underline">
            Lessen
          </Link>{" "}
          om content toe te voegen.
        </p>
      </div>

      {LEVEL_CODES.map((level) => (
        <Card key={level}>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{LEVEL_LABELS[level]}</CardTitle>
              {!AVAILABLE_LEVELS.includes(level) ? (
                <CardDescription>Nog niet vrijgegeven voor gebruikers</CardDescription>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILL_CODES.filter((skill) => skill !== "knm").map((skill) => (
                <LinkButton
                  key={skill}
                  href={`/admin/lessen?level=${level}&skill=${skill}`}
                  size="sm"
                  variant="outline"
                >
                  {SKILL_LABELS[skill]} — {countFor(level, skill)}
                </LinkButton>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Kennis van de Nederlandse Maatschappij</CardTitle>
            <CardDescription>Niet niveaugebonden — beheer via KNM.</CardDescription>
          </div>
          <LinkButton href="/admin/knm" size="sm" variant="outline">
            Beheren
          </LinkButton>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Proefexamens</CardTitle>
            <CardDescription>Sectiestructuur per niveau.</CardDescription>
          </div>
          <LinkButton href="/admin/examens" size="sm" variant="outline">
            Beheren
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
