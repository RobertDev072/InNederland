import { GraduationCap, Lightbulb, ListChecks, MessageSquareText, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WordExplainer } from "@/components/exercises/word-explainer";
import type { LessonContent } from "@/types/exercise-content";

/**
 * Renders the rich pedagogical parts of a lesson (intro, learning goals, vocabulary, grammar,
 * example sentences) above the interactive exercises. Everything is Dutch; clicking a vocabulary
 * word triggers an AI explanation in the learner's own language.
 */
export function LessonSections({
  content,
  nativeLanguage,
}: {
  content: LessonContent | null;
  nativeLanguage: string | null;
}) {
  if (!content) return null;

  const hasAnything =
    content.intro ||
    (content.learningGoals?.length ?? 0) > 0 ||
    (content.vocabulary?.length ?? 0) > 0 ||
    (content.grammar?.length ?? 0) > 0 ||
    (content.exampleSentences?.length ?? 0) > 0;

  if (!hasAnything) return null;

  return (
    <div className="flex flex-col gap-4">
      {content.intro ? (
        <Card>
          <CardContent className="flex gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-orange-500" />
            <p className="text-navy-700">{content.intro}</p>
          </CardContent>
        </Card>
      ) : null}

      {content.learningGoals && content.learningGoals.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <ListChecks className="size-4.5 text-navy-500" />
              Leerdoelen
            </h2>
            <ul className="list-disc pl-6 text-sm text-navy-700">
              {content.learningGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {content.vocabulary && content.vocabulary.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <Lightbulb className="size-4.5 text-navy-500" />
              Nieuwe woorden
            </h2>
            <ul className="flex flex-col divide-y divide-navy-100">
              {content.vocabulary.map((item, index) => (
                <li key={index} className="flex flex-col gap-0.5 py-2">
                  <WordExplainer word={item.word} nativeLanguage={nativeLanguage} />
                  {item.explanation ? (
                    <span className="text-sm text-navy-600">{item.explanation}</span>
                  ) : null}
                  {item.example ? (
                    <span className="text-sm italic text-navy-400">“{item.example}”</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {content.grammar && content.grammar.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <GraduationCap className="size-4.5 text-navy-500" />
              Grammatica
            </h2>
            {content.grammar.map((note, index) => (
              <div key={index} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-navy-800">{note.heading}</h3>
                <p className="whitespace-pre-line text-sm text-navy-700">{note.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {content.exampleSentences && content.exampleSentences.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <MessageSquareText className="size-4.5 text-navy-500" />
              Voorbeeldzinnen
            </h2>
            <ul className="flex flex-col gap-1.5 text-sm text-navy-700">
              {content.exampleSentences.map((sentence, index) => (
                <li key={index} className="rounded-lg bg-navy-50 px-3 py-2">
                  {sentence}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
