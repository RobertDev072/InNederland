import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";

/** Shown for fully paid-gated features (proefexamen, coach) when the user hasn't activated access yet. */
export function UpgradeNotice({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-navy-600">{message}</p>
        <a href="/toegang" className={buttonClasses("primary", "md", "gap-2")}>
          <MessageCircle className="size-4" />
          Toegang activeren
        </a>
      </CardContent>
    </Card>
  );
}
