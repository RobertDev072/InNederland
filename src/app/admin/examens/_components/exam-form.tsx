"use client";

import { useActionState } from "react";
import { createMockExam, updateMockExam, type AdminFormState, type AdminMockExamRow } from "@/lib/admin/content/exams";
import { EXAM_SKILLS } from "@/lib/admin/content/exam-skills";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEVEL_CODES, LEVEL_LABELS, SKILL_LABELS } from "@/types/content";

const initialState: AdminFormState = {};

export function ExamForm({ exam }: { exam?: AdminMockExamRow }) {
  const action = exam ? updateMockExam.bind(null, exam.id) : createMockExam;
  const [state, formAction, pending] = useActionState(action, initialState);

  const countFor = (skill: string) =>
    exam?.structure.sections.find((section) => section.skill === skill)?.exerciseCount ?? 0;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {!exam ? (
        <div>
          <Label htmlFor="level_code">Niveau</Label>
          <Select id="level_code" name="level_code" defaultValue="A2" required>
            {LEVEL_CODES.map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      <div>
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" defaultValue={exam?.title} required />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-navy-100 p-4">
        <p className="text-sm font-semibold text-navy-700">Aantal oefeningen per onderdeel</p>
        {EXAM_SKILLS.map((skill) => (
          <div key={skill} className="flex items-center justify-between gap-3">
            <Label htmlFor={`count_${skill}`} className="mb-0">
              {SKILL_LABELS[skill]}
            </Label>
            <Input
              id={`count_${skill}`}
              name={`count_${skill}`}
              type="number"
              min={0}
              defaultValue={countFor(skill)}
              className="w-24"
            />
          </div>
        ))}
      </div>

      {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

      <Button type="submit" loading={pending} className="mt-2 w-fit">
        {exam ? "Wijzigingen opslaan" : "Proefexamen aanmaken"}
      </Button>
    </form>
  );
}
