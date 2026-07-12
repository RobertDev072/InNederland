"use client";

import { useTransition } from "react";
import { deleteKnmTopic } from "@/lib/admin/content/knm";
import { Button } from "@/components/ui/button";

export function DeleteKnmButton({ topicId }: { topicId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Weet je zeker dat je dit hoofdstuk wilt verwijderen?")) return;
    startTransition(() => {
      deleteKnmTopic(topicId);
    });
  }

  return (
    <Button size="sm" variant="danger" disabled={isPending} onClick={handleDelete}>
      Verwijderen
    </Button>
  );
}
