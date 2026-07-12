"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExercise } from "@/lib/admin/content/lessons";
import { Button } from "@/components/ui/button";

export function DeleteExerciseButton({ lessonId, exerciseId }: { lessonId: string; exerciseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Weet je zeker dat je deze oefening wilt verwijderen?")) return;
    startTransition(async () => {
      await deleteExercise(lessonId, exerciseId);
      router.refresh();
    });
  }

  return (
    <Button size="sm" variant="danger" disabled={isPending} onClick={handleDelete}>
      Verwijderen
    </Button>
  );
}
