import Link from "next/link";
import { listLessons } from "@/lib/admin/content/lessons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { LEVEL_CODES, LEVEL_LABELS, SKILL_CODES, SKILL_LABELS } from "@/types/content";

export default async function AdminLessenPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; skill?: string }>;
}) {
  const { level, skill } = await searchParams;
  const lessons = await listLessons({ level, skill });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Lessen &amp; Oefeningen</h1>
          <p className="text-navy-500">{lessons.length} lessen</p>
        </div>
        <LinkButton href="/admin/lessen/nieuw" size="sm">
          + Nieuwe les
        </LinkButton>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="level" defaultValue={level ?? ""} className="max-w-[12rem]">
          <option value="">Alle niveaus</option>
          {LEVEL_CODES.map((code) => (
            <option key={code} value={code}>
              {LEVEL_LABELS[code]}
            </option>
          ))}
        </Select>
        <Select name="skill" defaultValue={skill ?? ""} className="max-w-[14rem]">
          <option value="">Alle vaardigheden</option>
          {SKILL_CODES.filter((code) => code !== "knm").map((code) => (
            <option key={code} value={code}>
              {SKILL_LABELS[code]}
            </option>
          ))}
        </Select>
        <button
          type="submit"
          className="rounded-full border border-navy-200 px-4 text-sm font-medium text-navy-700 hover:bg-navy-50"
        >
          Filteren
        </button>
      </form>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-navy-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Niveau</th>
              <th className="px-4 py-3 font-medium">Vaardigheid</th>
              <th className="px-4 py-3 font-medium">Oefeningen</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td className="px-4 py-3 text-navy-800">{lesson.title}</td>
                <td className="px-4 py-3 text-navy-600">{lesson.levelCode}</td>
                <td className="px-4 py-3 text-navy-600">{SKILL_LABELS[lesson.skillCode as keyof typeof SKILL_LABELS] ?? lesson.skillCode}</td>
                <td className="px-4 py-3 text-navy-600">{lesson.exerciseCount}</td>
                <td className="px-4 py-3">
                  {lesson.isFree ? <Badge variant="orange">Gratis preview</Badge> : <Badge variant="neutral">Betaald</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/lessen/${lesson.id}`} className="font-medium text-orange-600 hover:underline">
                    Beheren
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lessons.length === 0 ? <p className="p-4 text-navy-500">Geen lessen gevonden.</p> : null}
      </Card>
    </div>
  );
}
