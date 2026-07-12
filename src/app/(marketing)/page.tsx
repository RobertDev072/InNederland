import { getTranslations } from "next-intl/server";
import {
  BookOpenText,
  Ear,
  Landmark,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelPill } from "@/components/ui/level-pill";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS, SKILL_CODES, SKILL_LABELS } from "@/types/content";

const SKILL_ICONS: Record<string, typeof Mic> = {
  spreken: Mic,
  luisteren: Ear,
  lezen: BookOpenText,
  schrijven: PenLine,
  knm: Landmark,
};

export default async function HomePage() {
  const t = await getTranslations("Marketing");
  const tCommon = await getTranslations("Common");

  const SKILL_DESCRIPTIONS: Record<string, string> = {
    spreken: t("skillSprekenDesc"),
    luisteren: t("skillLuisterenDesc"),
    lezen: t("skillLezenDesc"),
    schrijven: t("skillSchrijvenDesc"),
    knm: t("skillKnmDesc"),
  };

  const TRUST_POINTS = [
    { icon: ShieldCheck, label: t("trustNoCopiedExams") },
    { icon: Sparkles, label: t("trustAiFeedback") },
    { icon: Target, label: t("trustStudyPlan") },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-navy-100 via-navy-50 to-transparent blur-2xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl md:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-navy-600">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href="/registreren" size="lg">
                {t("ctaStartFree")}
              </LinkButton>
              <LinkButton href="/login" variant="outline" size="lg">
                {t("ctaHaveAccount")}
              </LinkButton>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white/80 p-4 shadow-sm shadow-navy-900/5 backdrop-blur"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm font-medium text-navy-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-navy-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">{t("levelsTitle")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-navy-500">{t("levelsSubtitle")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVEL_CODES.map((level) => {
              const available = AVAILABLE_LEVELS.includes(level);
              return (
                <Card
                  key={level}
                  className="flex flex-col gap-3 p-6 transition-shadow hover:shadow-md hover:shadow-navy-900/10"
                >
                  <div className="flex items-center gap-3">
                    <LevelPill level={level} active={available} locked={!available} />
                    {!available && (
                      <span className="text-xs font-medium text-navy-400">{tCommon("comingSoon")}</span>
                    )}
                  </div>
                  <CardTitle className="text-base">{LEVEL_LABELS[level]}</CardTitle>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">{t("skillsTitle")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CODES.map((skill) => {
            const Icon = SKILL_ICONS[skill];
            return (
              <Card key={skill} className="transition-shadow hover:shadow-md hover:shadow-navy-900/10">
                <CardContent className="flex flex-col gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{SKILL_LABELS[skill]}</CardTitle>
                  <CardDescription>{SKILL_DESCRIPTIONS[skill]}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("ctaSectionTitle")}</h2>
          <p className="mt-3 text-navy-200">{t("ctaSectionBody")}</p>
          <div className="mt-6">
            <LinkButton href="/registreren" size="lg">
              {t("ctaSectionButton")}
            </LinkButton>
          </div>
          <p className="mt-4 text-xs text-navy-300">{t("disclaimer")}</p>
        </div>
      </section>
    </>
  );
}
