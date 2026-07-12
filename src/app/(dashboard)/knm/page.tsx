import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, hasFullAccess } from "@/lib/profile/queries";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default async function KnmPage() {
  const t = await getTranslations("Skills");
  const supabase = await createClient();
  const [{ data }, profile] = await Promise.all([
    supabase
      .from("knm_topics")
      .select("id, category, title, sort_order, is_free")
      .order("sort_order", { ascending: true }),
    getCurrentProfile(),
  ]);

  const topics = data ?? [];
  const fullAccess = hasFullAccess(profile);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{t("knmTitle")}</h1>
        <p className="mt-1 text-navy-500">{t("knmSubtitle")}</p>
      </div>

      {topics.length === 0 ? (
        <Card>
          <CardContent>
            <CardDescription>{t("noContentYet")}</CardDescription>
          </CardContent>
        </Card>
      ) : (
        topics.map((topic) => {
          const unlocked = fullAccess || topic.is_free;
          return (
            <Card key={topic.id}>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="navy" className="w-fit">
                      {topic.category}
                    </Badge>
                    {topic.is_free && !fullAccess ? <Badge variant="orange">Gratis</Badge> : null}
                  </div>
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                </div>
                {unlocked ? (
                  <LinkButton href={`/knm/${topic.id}`} size="sm" variant="outline">
                    Start
                  </LinkButton>
                ) : (
                  <LinkButton href="/toegang" size="sm" variant="ghost" className="gap-1.5 text-navy-400">
                    <Lock className="size-3.5" />
                    Op slot
                  </LinkButton>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
