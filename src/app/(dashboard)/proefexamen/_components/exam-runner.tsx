"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MultipleChoiceQuestion } from "@/components/exercises/multiple-choice-question";
import { asAnswer, asContent } from "@/types/exercise-content";
import { submitMockExam } from "@/lib/mock-exam/actions";
import { SKILL_LABELS, type SkillCode } from "@/types/content";
import type { MockExamExercise } from "@/lib/mock-exam/queries";
import type { Json } from "@/types/database";

interface ExerciseAnswer {
  skillCode: SkillCode;
  type: MockExamExercise["type"];
  correct?: boolean;
  responseText?: string;
}

interface MockExamReport {
  strengths: string[];
  improvements: string[];
  recommendedSkills: string[];
}

interface MockExamResult {
  totalScore: number;
  sectionScores: Record<string, number | string>;
  report: MockExamReport;
}

const LANGUAGE_SKILLS: SkillCode[] = ["lezen", "luisteren"];
const SUBMISSION_SKILLS: SkillCode[] = ["schrijven", "spreken"];

function getDisplayText(exercise: MockExamExercise): string {
  switch (exercise.type) {
    case "reading_text":
      return asContent("reading_text", exercise.content).text;
    case "listening_clip":
      return asContent("listening_clip", exercise.content).script;
    case "writing_task":
      return asContent("writing_task", exercise.content).instructions;
    case "speaking_prompt":
      return asContent("speaking_prompt", exercise.content).scenario;
    case "open_text":
      return asContent("open_text", exercise.content).question;
    default:
      return "";
  }
}

export function ExamRunner({
  mockExamId,
  exercises,
  nativeLanguage,
}: {
  mockExamId: string;
  exercises: MockExamExercise[];
  nativeLanguage: string | null;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExerciseAnswer[]>([]);
  const [freeText, setFreeText] = useState("");
  const [mcCorrect, setMcCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent>
          <CardDescription>Dit proefexamen bevat nog geen oefeningen.</CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (finished && result) {
    const scoreVariant = result.totalScore >= 70 ? "success" : "orange";
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Resultaat</CardTitle>
              <Badge variant={scoreVariant}>{result.totalScore}%</Badge>
            </div>
            <ProgressBar value={result.totalScore} />
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.sectionScores).map(([skill, score]) => (
                <Badge key={skill} variant="neutral">
                  {(SKILL_LABELS as Record<string, string>)[skill] ?? skill}:{" "}
                  {typeof score === "number" ? `${score}%` : score}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5">
            {result.report.strengths.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  Sterke punten
                </CardDescription>
                <ul className="list-inside list-disc text-sm text-navy-700">
                  {result.report.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.report.improvements.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  Verbeterpunten
                </CardDescription>
                <ul className="list-inside list-disc text-sm text-navy-700">
                  {result.report.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.report.recommendedSkills.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  Aanbevolen om te oefenen
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {result.report.recommendedSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {(SKILL_LABELS as Record<string, string>)[skill] ?? skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <LinkButton href="/dashboard" variant="primary">
          Terug naar dashboard
        </LinkButton>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;
  const isMultipleChoice = exercise.type === "multiple_choice";
  const canAdvance = isMultipleChoice ? mcCorrect !== null : freeText.trim().length > 0;

  async function finishExam(allAnswers: ExerciseAnswer[]) {
    setSubmitting(true);

    const mcPercentBySkill: Record<string, number> = {};
    const sectionScores: Record<string, number | string> = {};
    const skills = Array.from(new Set(allAnswers.map((answer) => answer.skillCode)));

    for (const skill of skills) {
      const skillAnswers = allAnswers.filter((answer) => answer.skillCode === skill);
      const mcAnswers = skillAnswers.filter((answer) => answer.type === "multiple_choice");
      if (mcAnswers.length > 0) {
        const correctCount = mcAnswers.filter((answer) => answer.correct).length;
        const percent = Math.round((correctCount / mcAnswers.length) * 100);
        mcPercentBySkill[skill] = percent;
        sectionScores[skill] = percent;
      } else {
        const submitted = skillAnswers.some(
          (answer) => (answer.responseText ?? "").trim().length > 0,
        );
        sectionScores[skill] = submitted ? "ingeleverd" : "niet ingeleverd";
      }
    }

    const languageScores = LANGUAGE_SKILLS.filter((skill) => skill in mcPercentBySkill).map(
      (skill) => mcPercentBySkill[skill],
    );
    const totalScore =
      languageScores.length > 0
        ? Math.round(languageScores.reduce((sum, score) => sum + score, 0) / languageScores.length)
        : 0;

    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendedSkills: SkillCode[] = [];

    const scoredEntries = Object.entries(mcPercentBySkill).sort((a, b) => a[1] - b[1]);
    if (scoredEntries.length === 1) {
      const [skill, percent] = scoredEntries[0];
      if (percent >= 70) {
        strengths.push(`Je scoorde goed op ${SKILL_LABELS[skill as SkillCode]} (${percent}%).`);
      } else {
        improvements.push(
          `${SKILL_LABELS[skill as SkillCode]} kan nog beter (${percent}%). Oefen hier extra mee.`,
        );
        recommendedSkills.push(skill as SkillCode);
      }
    } else if (scoredEntries.length > 1) {
      const [lowestSkill, lowestPercent] = scoredEntries[0];
      const [highestSkill, highestPercent] = scoredEntries[scoredEntries.length - 1];
      improvements.push(
        `${SKILL_LABELS[lowestSkill as SkillCode]} kan nog beter (${lowestPercent}%). Oefen hier extra mee.`,
      );
      recommendedSkills.push(lowestSkill as SkillCode);
      if (highestSkill !== lowestSkill) {
        strengths.push(
          `Je scoorde sterk op ${SKILL_LABELS[highestSkill as SkillCode]} (${highestPercent}%).`,
        );
      }
    }

    for (const skill of SUBMISSION_SKILLS) {
      if (sectionScores[skill] === "ingeleverd") {
        strengths.push(`Je hebt een antwoord ingeleverd voor ${SKILL_LABELS[skill]}.`);
      } else if (sectionScores[skill] === "niet ingeleverd") {
        improvements.push(`Je hebt nog geen antwoord ingeleverd voor ${SKILL_LABELS[skill]}.`);
        recommendedSkills.push(skill);
      }
    }

    const report: MockExamReport = {
      strengths: strengths.length > 0 ? strengths : ["Je hebt het proefexamen afgerond, goed gedaan!"],
      improvements,
      recommendedSkills: Array.from(new Set(recommendedSkills)),
    };

    try {
      await submitMockExam({
        mockExamId,
        sectionScores: sectionScores as unknown as Json,
        totalScore,
        report: report as unknown as Json,
      });
    } catch {
      // Best-effort: still show the local results even if saving the attempt fails.
    } finally {
      setResult({ totalScore, sectionScores, report });
      setFinished(true);
      setSubmitting(false);
    }
  }

  function handleNext() {
    const answer: ExerciseAnswer = {
      skillCode: exercise.skillCode,
      type: exercise.type,
      correct: isMultipleChoice ? (mcCorrect ?? false) : undefined,
      responseText: isMultipleChoice ? undefined : freeText,
    };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setFreeText("");
    setMcCorrect(null);

    if (isLast) {
      void finishExam(nextAnswers);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  let body: React.ReactNode;
  if (isMultipleChoice) {
    const content = asContent("multiple_choice", exercise.content);
    const correctAnswer = asAnswer("multiple_choice", exercise.correctAnswer);
    body = correctAnswer ? (
      <MultipleChoiceQuestion
        key={exercise.id}
        content={content}
        correctAnswer={correctAnswer}
        nativeLanguage={nativeLanguage}
        onAnswered={(correct) => setMcCorrect(correct)}
      />
    ) : (
      <p className="text-sm text-flag-red">Deze vraag ontbreekt een antwoord.</p>
    );
  } else {
    const displayText = getDisplayText(exercise);
    body = (
      <>
        <p className="font-medium text-navy-900">{exercise.prompt}</p>
        {displayText ? <p className="whitespace-pre-line text-navy-700">{displayText}</p> : null}
        <textarea
          key={exercise.id}
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          rows={5}
          placeholder="Typ hier je antwoord…"
          className="w-full rounded-lg border border-navy-200 bg-white px-3.5 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100"
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-navy-500">
        <span>
          Vraag {currentIndex + 1} van {exercises.length}
        </span>
        <Badge variant="neutral">{SKILL_LABELS[exercise.skillCode]}</Badge>
      </div>
      <ProgressBar value={(currentIndex / exercises.length) * 100} />

      <Card>
        <CardContent className="flex flex-col gap-4">{body}</CardContent>
      </Card>

      <Button onClick={handleNext} disabled={!canAdvance || submitting} loading={submitting}>
        {isLast ? "Voltooien" : "Volgende"}
      </Button>
    </div>
  );
}
