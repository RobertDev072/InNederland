"use client";

import { useActionState, useState } from "react";
import { createKnmTopic, updateKnmTopic, type AdminFormState, type AdminKnmTopicRow } from "@/lib/admin/content/knm";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AdminFormState = {};

export function KnmTopicForm({ topic }: { topic?: AdminKnmTopicRow }) {
  const action = topic ? updateKnmTopic.bind(null, topic.id) : createKnmTopic;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [sectionCount, setSectionCount] = useState(Math.max(1, topic?.content.sections.length ?? 1));
  const [questionCount, setQuestionCount] = useState(topic?.content.checkQuestions?.length ?? 0);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="category">Categorie</Label>
        <Input id="category" name="category" defaultValue={topic?.category} required />
      </div>
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" defaultValue={topic?.title} required />
      </div>
      <div>
        <Label htmlFor="sort_order">Volgorde</Label>
        <Input id="sort_order" name="sort_order" type="number" min={1} defaultValue={topic?.sortOrder ?? 1} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy-700">
        <input type="checkbox" name="is_free" defaultChecked={topic?.isFree} className="size-4 rounded border-navy-300" />
        Gratis preview-hoofdstuk
      </label>

      <div className="flex flex-col gap-4 rounded-lg border border-navy-100 p-4">
        <p className="text-sm font-semibold text-navy-700">Secties</p>
        {Array.from({ length: sectionCount }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2 border-b border-navy-100 pb-4 last:border-0 last:pb-0">
            <Input
              name={`section_heading_${index + 1}`}
              defaultValue={topic?.content.sections[index]?.heading}
              placeholder={`Kop ${index + 1}`}
            />
            <textarea
              name={`section_body_${index + 1}`}
              defaultValue={topic?.content.sections[index]?.body}
              rows={3}
              placeholder={`Tekst ${index + 1}`}
              className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
            />
          </div>
        ))}
        {sectionCount < 5 ? (
          <button
            type="button"
            onClick={() => setSectionCount((count) => Math.min(5, count + 1))}
            className="w-fit text-sm font-medium text-orange-600 hover:underline"
          >
            + Nog een sectie
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-navy-100 p-4">
        <p className="text-sm font-semibold text-navy-700">Controlevragen (optioneel)</p>
        {Array.from({ length: questionCount }).map((_, index) => {
          const question = topic?.content.checkQuestions?.[index];
          return (
            <div key={index} className="flex flex-col gap-2 border-b border-navy-100 pb-4 last:border-0 last:pb-0">
              <Input name={`question_${index + 1}`} defaultValue={question?.question} placeholder="Vraag" />
              {[1, 2, 3, 4].map((n) => (
                <Input
                  key={n}
                  name={`question_${index + 1}_option_${n}`}
                  defaultValue={question?.options?.[n - 1]}
                  placeholder={`Optie ${n}`}
                />
              ))}
              <div>
                <Label htmlFor={`question_${index + 1}_correct_index`}>Juiste antwoord (0-3)</Label>
                <Input
                  id={`question_${index + 1}_correct_index`}
                  name={`question_${index + 1}_correct_index`}
                  type="number"
                  min={0}
                  max={3}
                  defaultValue={question?.correctIndex ?? 0}
                />
              </div>
            </div>
          );
        })}
        {questionCount < 3 ? (
          <button
            type="button"
            onClick={() => setQuestionCount((count) => Math.min(3, count + 1))}
            className="w-fit text-sm font-medium text-orange-600 hover:underline"
          >
            + Nog een controlevraag
          </button>
        ) : null}
      </div>

      {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

      <Button type="submit" loading={pending} className="mt-2 w-fit">
        {topic ? "Wijzigingen opslaan" : "Hoofdstuk aanmaken"}
      </Button>
    </form>
  );
}
