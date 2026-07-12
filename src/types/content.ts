export const LEVEL_CODES = ["A1", "A2", "B1", "B2"] as const;
export type LevelCode = (typeof LEVEL_CODES)[number];

export const SKILL_CODES = ["spreken", "luisteren", "lezen", "schrijven", "knm"] as const;
export type SkillCode = (typeof SKILL_CODES)[number];

export const LEVEL_LABELS: Record<LevelCode, string> = {
  A1: "A1 — Basis Nederlands",
  A2: "A2 — Inburgering",
  B1: "B1 — Staatsexamen NT2 I",
  B2: "B2 — Staatsexamen NT2 II",
};

export const SKILL_LABELS: Record<SkillCode, string> = {
  spreken: "Spreken",
  luisteren: "Luisteren",
  lezen: "Lezen",
  schrijven: "Schrijven",
  knm: "Kennis van de Nederlandse Maatschappij",
};

/** Levels with real content in this build. Others render as "binnenkort beschikbaar". */
export const AVAILABLE_LEVELS: LevelCode[] = ["A1", "A2"];
