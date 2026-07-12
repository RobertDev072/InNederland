import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export default async function KnmPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("knm_topics")
    .select("id, category, title, sort_order")
    .order("sort_order", { ascending: true });

  const topics = data ?? [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Kennis van de Nederlandse Maatschappij</h1>
        <p className="mt-1 text-navy-500">
          Leer over Nederland: geschiedenis, wonen, werken en de Nederlandse samenleving.
        </p>
      </div>

      {topics.length === 0 ? (
        <Card>
          <CardContent>
            <CardDescription>Nog geen inhoud beschikbaar.</CardDescription>
          </CardContent>
        </Card>
      ) : (
        topics.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Badge variant="navy" className="w-fit">
                  {topic.category}
                </Badge>
                <CardTitle className="text-base">{topic.title}</CardTitle>
              </div>
              <LinkButton href={`/knm/${topic.id}`} size="sm" variant="outline">
                Start
              </LinkButton>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
