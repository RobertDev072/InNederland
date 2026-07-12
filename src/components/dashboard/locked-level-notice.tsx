import { Card, CardContent } from "@/components/ui/card";
import { LEVEL_LABELS, type LevelCode } from "@/types/content";

/** Shown on a skill's listing page when the user's target level has no content yet. */
export function LockedLevelNotice({ targetLevel }: { targetLevel: LevelCode | null }) {
  return (
    <Card>
      <CardContent>
        <p className="text-navy-600">
          {targetLevel
            ? `Content voor ${LEVEL_LABELS[targetLevel]} is nog in ontwikkeling. Je kunt alvast starten met A2 — Inburgering.`
            : "Kies eerst je niveau in je studieplan om oefeningen te zien."}
        </p>
      </CardContent>
    </Card>
  );
}
