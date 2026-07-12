import Link from "next/link";
import { listMockExams } from "@/lib/admin/content/exams";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { LEVEL_LABELS, SKILL_LABELS, type LevelCode } from "@/types/content";

export default async function AdminExamsPage() {
  const exams = await listMockExams();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Examens</h1>
          <p className="text-navy-500">{exams.length} proefexamens</p>
        </div>
        <LinkButton href="/admin/examens/nieuw" size="sm">
          + Nieuw proefexamen
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-navy-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Niveau</th>
              <th className="px-4 py-3 font-medium">Onderdelen</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td className="px-4 py-3 text-navy-800">{exam.title}</td>
                <td className="px-4 py-3 text-navy-600">
                  {LEVEL_LABELS[exam.levelCode as LevelCode] ?? exam.levelCode}
                </td>
                <td className="px-4 py-3 text-navy-600">
                  {exam.structure.sections
                    .map((section) => `${SKILL_LABELS[section.skill]} (${section.exerciseCount})`)
                    .join(", ")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/examens/${exam.id}`} className="font-medium text-orange-600 hover:underline">
                    Beheren
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {exams.length === 0 ? <p className="p-4 text-navy-500">Nog geen proefexamens.</p> : null}
      </Card>
    </div>
  );
}
