-- Rich lesson content: intro, learning goals, vocabulary, grammar notes, example sentences.
-- Stored as a single jsonb blob on the lesson (interactive parts stay in the exercises table).
-- Shape mirrors the LessonContent type in src/types/exercise-content.ts.

alter table lessons
  add column content jsonb;
