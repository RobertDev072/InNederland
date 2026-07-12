import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ExerciseForm } from "../../_components/exercise-form";
import type { ExerciseType } from "@/types/database";

const TYPE_OPTIONS: { type: ExerciseType; label: string; description: string }[] = [
  { type: "reading_text", label: "Leestekst", description: "Tekst + begripsvragen (Lezen)" },
  { type: "listening_clip", label: "Luisterfragment", description: "Script/video + begripsvragen (Luisteren)" },
  { type: "writing_task", label: "Schrijfopdracht", description: "Instructies voor een schrijftaak (Schrijven)" },
  { type: "speaking_prompt", label: "Spreekopdracht", description: "Scenario om hardop te oefenen (Spreken)" },
  { type: "multiple_choice", label: "Meerkeuzevraag", description: "Begripsvraag met opties" },
  { type: "open_text", label: "Open vraag", description: "Vrije tekstvraag met voorbeeldantwoord" },
];

export default async function NewExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { lessonId } = await params;
  const { type } = await searchParams;
  const selectedType = TYPE_OPTIONS.find((option) => option.type === type)?.type;

  if (!selectedType) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-navy-900">Kies een oefentype</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {TYPE_OPTIONS.map((option) => (
            <Link key={option.type} href={`?type=${option.type}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent>
                  <CardTitle className="text-base">{option.label}</CardTitle>
                  <p className="mt-1 text-sm text-navy-500">{option.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">
        Nieuwe oefening — {TYPE_OPTIONS.find((option) => option.type === selectedType)?.label}
      </h1>
      <Card>
        <CardContent>
          <ExerciseForm lessonId={lessonId} type={selectedType} />
        </CardContent>
      </Card>
    </div>
  );
}
