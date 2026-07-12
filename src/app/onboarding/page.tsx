"use client";

import { useActionState } from "react";
import { completeOnboarding, type OnboardingFormState } from "@/lib/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Logo } from "@/components/layout/logo";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS } from "@/types/content";

const initialState: OnboardingFormState = {};

const MINUTE_OPTIONS = [10, 15, 30, 45, 60];

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(completeOnboarding, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy-50 px-4 py-12">
      <Logo priority />
      <div className="w-full max-w-lg rounded-card border border-navy-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-navy-900">Jouw persoonlijke studieplan</h1>
        <p className="mt-1 text-sm text-navy-500">
          Beantwoord een paar korte vragen — wij stellen automatisch een leerplan voor je samen.
        </p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="native_language">Wat is uw moedertaal?</Label>
            <Input id="native_language" name="native_language" placeholder="Bijv. Engels, Arabisch, Pools…" required />
          </div>

          <div>
            <Label htmlFor="target_level">Welk niveau/examen wilt u behalen?</Label>
            <Select id="target_level" name="target_level" defaultValue="A2" required>
              {LEVEL_CODES.map((level) => (
                <option key={level} value={level}>
                  {LEVEL_LABELS[level]}
                  {!AVAILABLE_LEVELS.includes(level) ? " (binnenkort)" : ""}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="target_exam_date">Wanneer wilt u examen doen? (optioneel)</Label>
            <Input id="target_exam_date" name="target_exam_date" type="date" />
          </div>

          <div>
            <Label htmlFor="minutes_per_day">Hoeveel minuten kunt u per dag leren?</Label>
            <Select id="minutes_per_day" name="minutes_per_day" defaultValue="15" required>
              {MINUTE_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minuten
                </option>
              ))}
            </Select>
          </div>

          {state.error ? <p className="text-sm text-flag-red">{state.error}</p> : null}

          <Button type="submit" loading={pending} className="mt-2 w-full">
            Maak mijn studieplan
          </Button>
        </form>
      </div>
    </div>
  );
}
