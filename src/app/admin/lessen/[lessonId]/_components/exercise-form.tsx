"use client";

import { useActionState, useState } from "react";
import { saveExercise, type AdminExerciseRow, type AdminFormState } from "@/lib/admin/content/lessons";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  asAnswer,
  asContent,
  type MultipleChoiceAnswer,
  type MultipleChoiceContent,
  type OpenTextAnswer,
  type ReadingTextContent,
  type SpeakingPromptContent,
  type WritingTaskContent,
  type ListeningClipContent,
  type OpenTextContent,
} from "@/types/exercise-content";
import type { ExerciseType } from "@/types/database";

const TYPE_LABELS: Record<ExerciseType, string> = {
  reading_text: "Leestekst",
  listening_clip: "Luisterfragment",
  writing_task: "Schrijfopdracht",
  speaking_prompt: "Spreekopdracht",
  multiple_choice: "Meerkeuzevraag",
  open_text: "Open vraag",
};

const initialState: AdminFormState = {};

export function ExerciseForm({
  lessonId,
  type,
  exercise,
}: {
  lessonId: string;
  type: ExerciseType;
  exercise?: AdminExerciseRow;
}) {
  const boundAction = saveExercise.bind(null, lessonId, exercise?.id ?? null);
  const [state, action, pending] = useActionState(boundAction, initialState);
  const [optionCount, setOptionCount] = useState(() => {
    if (type !== "multiple_choice" || !exercise) return 4;
    const content = asContent("multiple_choice", exercise.content) as MultipleChoiceContent;
    return Math.max(2, content.options?.length ?? 4);
  });

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="type" value={type} />

      <div>
        <Label htmlFor="prompt">Prompt / instructie</Label>
        <Input id="prompt" name="prompt" defaultValue={exercise?.prompt} required />
      </div>

      <div>
        <Label htmlFor="sort_order">Volgorde</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          min={1}
          defaultValue={exercise?.sortOrder ?? 1}
        />
      </div>

      {type === "reading_text" ? <ReadingTextFields exercise={exercise} /> : null}
      {type === "listening_clip" ? <ListeningClipFields exercise={exercise} /> : null}
      {type === "writing_task" ? <WritingTaskFields exercise={exercise} /> : null}
      {type === "speaking_prompt" ? <SpeakingPromptFields exercise={exercise} /> : null}
      {type === "open_text" ? <OpenTextFields exercise={exercise} /> : null}
      {type === "multiple_choice" ? (
        <MultipleChoiceFields
          exercise={exercise}
          optionCount={optionCount}
          onAddOption={() => setOptionCount((count) => Math.min(4, count + 1))}
        />
      ) : null}

      {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

      <Button type="submit" loading={pending} className="mt-2 w-fit">
        {exercise ? "Wijzigingen opslaan" : `${TYPE_LABELS[type]} toevoegen`}
      </Button>
    </form>
  );
}

function ReadingTextFields({ exercise }: { exercise?: AdminExerciseRow }) {
  const content = exercise ? (asContent("reading_text", exercise.content) as ReadingTextContent) : undefined;
  return (
    <>
      <div>
        <Label htmlFor="text">Leestekst</Label>
        <textarea
          id="text"
          name="text"
          rows={6}
          defaultValue={content?.text}
          required
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <ImageUploadField name="image_url" defaultValue={content?.imageUrl} />
    </>
  );
}

function ListeningClipFields({ exercise }: { exercise?: AdminExerciseRow }) {
  const content = exercise
    ? (asContent("listening_clip", exercise.content) as ListeningClipContent)
    : undefined;
  return (
    <>
      <div>
        <Label htmlFor="script">Script (voor tekst-naar-spraak, optioneel als je een video gebruikt)</Label>
        <textarea
          id="script"
          name="script"
          rows={4}
          defaultValue={content?.script}
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="youtube_video_id">YouTube video-id (optioneel)</Label>
        <Input
          id="youtube_video_id"
          name="youtube_video_id"
          defaultValue={content?.youtubeVideoId}
          placeholder="bijv. GOxnKRefO84"
        />
      </div>
    </>
  );
}

function WritingTaskFields({ exercise }: { exercise?: AdminExerciseRow }) {
  const content = exercise ? (asContent("writing_task", exercise.content) as WritingTaskContent) : undefined;
  return (
    <>
      <div>
        <Label htmlFor="instructions">Instructies</Label>
        <textarea
          id="instructions"
          name="instructions"
          rows={4}
          defaultValue={content?.instructions}
          required
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="min_words">Minimum aantal woorden (optioneel)</Label>
        <Input id="min_words" name="min_words" type="number" min={1} defaultValue={content?.minWords} />
      </div>
    </>
  );
}

function SpeakingPromptFields({ exercise }: { exercise?: AdminExerciseRow }) {
  const content = exercise
    ? (asContent("speaking_prompt", exercise.content) as SpeakingPromptContent)
    : undefined;
  return (
    <>
      <div>
        <Label htmlFor="scenario">Scenario</Label>
        <textarea
          id="scenario"
          name="scenario"
          rows={4}
          defaultValue={content?.scenario}
          required
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="expected_points">Verwachte punten (één per regel, optioneel)</Label>
        <textarea
          id="expected_points"
          name="expected_points"
          rows={3}
          defaultValue={content?.expectedPoints?.join("\n")}
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="youtube_video_id">YouTube video-id (optioneel voorbeeld)</Label>
        <Input id="youtube_video_id" name="youtube_video_id" defaultValue={content?.youtubeVideoId} />
      </div>
      <ImageUploadField name="image_url" defaultValue={content?.imageUrl} />
    </>
  );
}

function OpenTextFields({ exercise }: { exercise?: AdminExerciseRow }) {
  const content = exercise ? (asContent("open_text", exercise.content) as OpenTextContent) : undefined;
  const answer = exercise ? (asAnswer("open_text", exercise.correctAnswer) as OpenTextAnswer | null) : null;
  return (
    <>
      <div>
        <Label htmlFor="question">Vraag</Label>
        <textarea
          id="question"
          name="question"
          rows={3}
          defaultValue={content?.question}
          required
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="answer">Voorbeeldantwoord (optioneel)</Label>
        <Input id="answer" name="answer" defaultValue={answer?.answer} />
      </div>
      <div>
        <Label htmlFor="explanation">Uitleg (optioneel)</Label>
        <Input id="explanation" name="explanation" defaultValue={answer?.explanation} />
      </div>
    </>
  );
}

function MultipleChoiceFields({
  exercise,
  optionCount,
  onAddOption,
}: {
  exercise?: AdminExerciseRow;
  optionCount: number;
  onAddOption: () => void;
}) {
  const content = exercise
    ? (asContent("multiple_choice", exercise.content) as MultipleChoiceContent)
    : undefined;
  const answer = exercise
    ? (asAnswer("multiple_choice", exercise.correctAnswer) as MultipleChoiceAnswer | null)
    : null;

  return (
    <>
      <div>
        <Label htmlFor="question">Vraag</Label>
        <textarea
          id="question"
          name="question"
          rows={3}
          defaultValue={content?.question}
          required
          className="w-full rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Opties</Label>
        {Array.from({ length: optionCount }).map((_, index) => (
          <Input
            key={index}
            name={`option_${index + 1}`}
            defaultValue={content?.options?.[index]}
            placeholder={`Optie ${index + 1}`}
            required={index < 2}
          />
        ))}
        {optionCount < 4 ? (
          <button
            type="button"
            onClick={onAddOption}
            className="w-fit text-sm font-medium text-orange-600 hover:underline"
          >
            + Nog een optie
          </button>
        ) : null}
      </div>

      <div>
        <Label htmlFor="correct_index">Juiste antwoord</Label>
        <Select id="correct_index" name="correct_index" defaultValue={String(answer?.correctIndex ?? 0)}>
          {Array.from({ length: optionCount }).map((_, index) => (
            <option key={index} value={index}>
              Optie {index + 1}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="explanation">Uitleg bij fout antwoord (optioneel)</Label>
        <Input id="explanation" name="explanation" defaultValue={answer?.explanation} />
      </div>
    </>
  );
}
