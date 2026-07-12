"use client";

import { useTransition } from "react";
import Link from "next/link";
import { BookOpenText, Ear, Landmark, Mic, PenLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { toggleStudyPlanItem } from "@/lib/study-plan/actions";
import type { StudyPlanView } from "@/lib/study-plan/queries";

const SKILL_ICON = {
  spreken: Mic,
  luisteren: Ear,
  lezen: BookOpenText,
  schrijven: PenLine,
  knm: Landmark,
} as const;

export function StudyPlanCard({ plan }: { plan: StudyPlanView }) {
  const [isPending, startTransition] = useTransition();
  const done = plan.items.filter((item) => item.status === "done").length;
  const progress = plan.items.length > 0 ? (done / plan.items.length) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Studieplan — week {plan.weekNumber}</CardTitle>
          <CardDescription>
            {done} van {plan.items.length} onderdelen afgerond
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ProgressBar value={progress} />
        <ul className="flex flex-col divide-y divide-navy-100">
          {plan.items.map((item) => {
            const Icon = SKILL_ICON[item.skillCode as keyof typeof SKILL_ICON] ?? BookOpenText;
            const isDone = item.status === "done";
            return (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => {
                      toggleStudyPlanItem(item.id, isDone ? "todo" : "done");
                    })
                  }
                  aria-label={isDone ? "Markeer als niet afgerond" : "Markeer als afgerond"}
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isDone ? "border-orange-500 bg-orange-500 text-white" : "border-navy-200",
                  )}
                >
                  {isDone ? "✓" : null}
                </button>
                <Icon className="size-4 shrink-0 text-navy-400" />
                <Link
                  href={`/${item.skillCode}/${item.lessonId}`}
                  className={cn(
                    "flex-1 text-sm font-medium",
                    isDone ? "text-navy-400 line-through" : "text-navy-800 hover:text-orange-600",
                  )}
                >
                  {item.lessonTitle}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
