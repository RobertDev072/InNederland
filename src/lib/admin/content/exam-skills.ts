import { SKILL_CODES, type SkillCode } from "@/types/content";

/** Proefexamen sections only cover the four graded skills, not KNM. */
export const EXAM_SKILLS = SKILL_CODES.filter(
  (skill): skill is Exclude<SkillCode, "knm"> => skill !== "knm",
);
