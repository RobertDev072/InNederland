/** Shared shape for AI-graded writing/speaking feedback (returned by the feedback API routes). */

export interface WritingFeedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  correctedText: string;
}

export interface SpeakingFeedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  missedPoints: string[];
}
