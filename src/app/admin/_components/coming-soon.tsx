import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-400">
            <Icon className="size-6" />
          </span>
          <CardTitle className="text-base">Binnenkort beschikbaar</CardTitle>
          <CardDescription className="max-w-sm">{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
