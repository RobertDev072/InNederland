"use client";

import { useTransition } from "react";
import { deleteMockExam } from "@/lib/admin/content/exams";
import { Button } from "@/components/ui/button";

export function DeleteExamButton({ examId }: { examId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Weet je zeker dat je dit proefexamen wilt verwijderen?")) return;
    startTransition(() => {
      deleteMockExam(examId);
    });
  }

  return (
    <Button size="sm" variant="danger" disabled={isPending} onClick={handleDelete}>
      Verwijderen
    </Button>
  );
}
