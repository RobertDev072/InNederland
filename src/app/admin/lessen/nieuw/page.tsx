"use client";

import { useActionState } from "react";
import { createLesson, type AdminFormState } from "@/lib/admin/content/lessons";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LEVEL_CODES, LEVEL_LABELS, SKILL_CODES, SKILL_LABELS } from "@/types/content";

const initialState: AdminFormState = {};

export default function NewLessonPage() {
  const [state, action, pending] = useActionState(createLesson, initialState);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Nieuwe les</h1>
      <Card>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="level_code">Niveau</Label>
              <Select id="level_code" name="level_code" defaultValue="A2" required>
                {LEVEL_CODES.map((code) => (
                  <option key={code} value={code}>
                    {LEVEL_LABELS[code]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="skill_code">Vaardigheid</Label>
              <Select id="skill_code" name="skill_code" defaultValue="lezen" required>
                {SKILL_CODES.filter((code) => code !== "knm").map((code) => (
                  <option key={code} value={code}>
                    {SKILL_LABELS[code]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="description">Beschrijving (optioneel)</Label>
              <Input id="description" name="description" />
            </div>
            <div>
              <Label htmlFor="sort_order">Volgorde</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={1} min={1} />
            </div>
            <label className="flex items-center gap-2 text-sm text-navy-700">
              <input type="checkbox" name="is_free" className="size-4 rounded border-navy-300" />
              Gratis preview-les
            </label>

            {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

            <Button type="submit" loading={pending} className="mt-2 w-full">
              Les aanmaken
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
