export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ExerciseType =
  | "multiple_choice"
  | "open_text"
  | "speaking_prompt"
  | "listening_clip"
  | "reading_text"
  | "writing_task";

export type StudyPlanItemStatus = "todo" | "done";
export type CoachRole = "user" | "assistant";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          native_language: string | null;
          target_level: string | null;
          target_exam_date: string | null;
          minutes_per_day: number | null;
          onboarding_completed: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      levels: {
        Row: { code: string; name: string; description: string | null; sort_order: number };
        Insert: Database["public"]["Tables"]["levels"]["Row"];
        Update: Partial<Database["public"]["Tables"]["levels"]["Row"]>;
        Relationships: [];
      };
      skills: {
        Row: { code: string; name: string };
        Insert: Database["public"]["Tables"]["skills"]["Row"];
        Update: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          level_code: string;
          skill_code: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          lesson_id: string;
          type: ExerciseType;
          prompt: string;
          content: Json;
          correct_answer: Json | null;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["exercises"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
        Relationships: [];
      };
      exercise_attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          response: Json;
          ai_feedback: Json | null;
          score: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["exercise_attempts"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercise_attempts"]["Row"]>;
        Relationships: [];
      };
      study_plans: {
        Row: { id: string; user_id: string; week_number: number; generated_at: string };
        Insert: Omit<Database["public"]["Tables"]["study_plans"]["Row"], "id" | "generated_at"> & {
          id?: string;
          generated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["study_plans"]["Row"]>;
        Relationships: [];
      };
      study_plan_items: {
        Row: {
          id: string;
          study_plan_id: string;
          lesson_id: string;
          status: StudyPlanItemStatus;
          due_date: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["study_plan_items"]["Row"], "id" | "due_date"> & {
          id?: string;
          due_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["study_plan_items"]["Row"]>;
        Relationships: [];
      };
      mock_exams: {
        Row: { id: string; level_code: string; title: string; structure: Json };
        Insert: Omit<Database["public"]["Tables"]["mock_exams"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["mock_exams"]["Row"]>;
        Relationships: [];
      };
      mock_exam_attempts: {
        Row: {
          id: string;
          user_id: string;
          mock_exam_id: string;
          started_at: string;
          completed_at: string | null;
          total_score: number | null;
          section_scores: Json | null;
          report: Json | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["mock_exam_attempts"]["Row"],
          "id" | "started_at" | "completed_at" | "total_score" | "section_scores" | "report"
        > & {
          id?: string;
          started_at?: string;
          completed_at?: string | null;
          total_score?: number | null;
          section_scores?: Json | null;
          report?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["mock_exam_attempts"]["Row"]>;
        Relationships: [];
      };
      knm_topics: {
        Row: { id: string; category: string; title: string; content: Json; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["knm_topics"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["knm_topics"]["Row"]>;
        Relationships: [];
      };
      vocabulary: {
        Row: {
          id: string;
          level_code: string;
          word: string;
          translations: Json;
          example_sentence: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["vocabulary"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["vocabulary"]["Row"]>;
        Relationships: [];
      };
      coach_conversations: {
        Row: { id: string; user_id: string; title: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["coach_conversations"]["Row"], "id" | "created_at" | "title"> & {
          id?: string;
          created_at?: string;
          title?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["coach_conversations"]["Row"]>;
        Relationships: [];
      };
      coach_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: CoachRole;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["coach_messages"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coach_messages"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
