import { Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function LessonListItem({
  id,
  title,
  description,
  isFree,
  hasFullAccess,
  hrefBase,
}: {
  id: string;
  title: string;
  description?: string | null;
  isFree: boolean;
  hasFullAccess: boolean;
  hrefBase: string;
}) {
  const t = await getTranslations("Common");
  const unlocked = hasFullAccess || isFree;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {isFree && !hasFullAccess ? <Badge variant="orange">{t("free")}</Badge> : null}
          </div>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {unlocked ? (
          <LinkButton href={`${hrefBase}/${id}`} size="sm" variant="outline">
            Start
          </LinkButton>
        ) : (
          <LinkButton href="/toegang" size="sm" variant="ghost" className="gap-1.5 text-navy-400">
            <Lock className="size-3.5" />
            {t("locked")}
          </LinkButton>
        )}
      </CardContent>
    </Card>
  );
}
