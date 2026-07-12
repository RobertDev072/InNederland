"use client";

import { useActionState } from "react";
import { updateLesson, type AdminFormState, type AdminLessonDetail } from "@/lib/admin/content/lessons";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AdminFormState = {};

export function LessonEditForm({ lessonId, lesson }: { lessonId: string; lesson: AdminLessonDetail }) {
  const boundAction = updateLesson.bind(null, lessonId);
  const [state, action, pending] = useActionState(boundAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" defaultValue={lesson.title} required />
      </div>
      <div>
        <Label htmlFor="description">Beschrijving</Label>
        <Input id="description" name="description" defaultValue={lesson.description ?? ""} />
      </div>
      <div>
        <Label htmlFor="sort_order">Volgorde</Label>
        <Input id="sort_order" name="sort_order" type="number" defaultValue={lesson.sortOrder} min={1} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy-700">
        <input
          type="checkbox"
          name="is_free"
          defaultChecked={lesson.isFree}
          className="size-4 rounded border-navy-300"
        />
        Gratis preview-les
      </label>

      {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

      <Button type="submit" size="sm" loading={pending} className="w-fit">
        Opslaan
      </Button>
    </form>
  );
}
