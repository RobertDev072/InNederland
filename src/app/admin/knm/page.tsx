import Link from "next/link";
import { listKnmTopics } from "@/lib/admin/content/knm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export default async function AdminKnmPage() {
  const topics = await listKnmTopics();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">KNM</h1>
          <p className="text-navy-500">{topics.length} hoofdstukken</p>
        </div>
        <LinkButton href="/admin/knm/nieuw" size="sm">
          + Nieuw hoofdstuk
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-navy-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Categorie</th>
              <th className="px-4 py-3 font-medium">Secties</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td className="px-4 py-3 text-navy-800">{topic.title}</td>
                <td className="px-4 py-3 text-navy-600">{topic.category}</td>
                <td className="px-4 py-3 text-navy-600">{topic.content.sections?.length ?? 0}</td>
                <td className="px-4 py-3">
                  {topic.isFree ? <Badge variant="orange">Gratis preview</Badge> : <Badge variant="neutral">Betaald</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/knm/${topic.id}`} className="font-medium text-orange-600 hover:underline">
                    Beheren
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {topics.length === 0 ? <p className="p-4 text-navy-500">Nog geen KNM-hoofdstukken.</p> : null}
      </Card>
    </div>
  );
}
