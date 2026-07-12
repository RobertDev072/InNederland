-- InNederland.ai — initial schema
-- Content tables (levels, skills, lessons, exercises, knm_topics, mock_exams, vocabulary) are publicly
-- readable and written only via the service role (migrations/seed/admin scripts).
-- User tables are protected by row-level security so each user only ever sees their own rows.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table levels (
  code text primary key,
  name text not null,
  description text,
  sort_order int not null default 0
);

create table skills (
  code text primary key,
  name text not null
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  level_code text not null references levels (code) on delete cascade,
  skill_code text not null references skills (code) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index lessons_level_skill_idx on lessons (level_code, skill_code, sort_order);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  type text not null check (
    type in (
      'multiple_choice',
      'open_text',
      'speaking_prompt',
      'listening_clip',
      'reading_text',
      'writing_task'
    )
  ),
  prompt text not null,
  content jsonb not null default '{}'::jsonb,
  correct_answer jsonb,
  sort_order int not null default 0
);
create index exercises_lesson_idx on exercises (lesson_id, sort_order);

create table knm_topics (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order int not null default 0
);

create table mock_exams (
  id uuid primary key default gen_random_uuid(),
  level_code text not null references levels (code) on delete cascade,
  title text not null,
  structure jsonb not null default '{}'::jsonb
);

create table vocabulary (
  id uuid primary key default gen_random_uuid(),
  level_code text not null references levels (code) on delete cascade,
  word text not null,
  translations jsonb not null default '{}'::jsonb,
  example_sentence text
);

-- ---------------------------------------------------------------------------
-- User tables
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  native_language text,
  target_level text references levels (code),
  target_exam_date date,
  minutes_per_day int,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  response jsonb not null default '{}'::jsonb,
  ai_feedback jsonb,
  score numeric,
  created_at timestamptz not null default now()
);
create index exercise_attempts_user_idx on exercise_attempts (user_id, exercise_id, created_at desc);

create table study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_number int not null,
  generated_at timestamptz not null default now()
);
create index study_plans_user_idx on study_plans (user_id, week_number);

create table study_plan_items (
  id uuid primary key default gen_random_uuid(),
  study_plan_id uuid not null references study_plans (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status text not null default 'todo' check (status in ('todo', 'done')),
  due_date date
);
create index study_plan_items_plan_idx on study_plan_items (study_plan_id);

create table mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mock_exam_id uuid not null references mock_exams (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_score numeric,
  section_scores jsonb,
  report jsonb
);
create index mock_exam_attempts_user_idx on mock_exam_attempts (user_id, started_at desc);

create table coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);
create index coach_conversations_user_idx on coach_conversations (user_id, created_at desc);

create table coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references coach_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index coach_messages_conversation_idx on coach_messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up
-- ---------------------------------------------------------------------------

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table levels enable row level security;
alter table skills enable row level security;
alter table lessons enable row level security;
alter table exercises enable row level security;
alter table knm_topics enable row level security;
alter table mock_exams enable row level security;
alter table vocabulary enable row level security;

create policy "levels are publicly readable" on levels for select using (true);
create policy "skills are publicly readable" on skills for select using (true);
create policy "lessons are publicly readable" on lessons for select using (true);
create policy "exercises are publicly readable" on exercises for select using (true);
create policy "knm_topics are publicly readable" on knm_topics for select using (true);
create policy "mock_exams are publicly readable" on mock_exams for select using (true);
create policy "vocabulary is publicly readable" on vocabulary for select using (true);

alter table profiles enable row level security;
alter table exercise_attempts enable row level security;
alter table study_plans enable row level security;
alter table study_plan_items enable row level security;
alter table mock_exam_attempts enable row level security;
alter table coach_conversations enable row level security;
alter table coach_messages enable row level security;

create policy "users manage their own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "users manage their own exercise attempts" on exercise_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own study plans" on study_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own study plan items" on study_plan_items
  for all using (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_items.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_items.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  );

create policy "users manage their own mock exam attempts" on mock_exam_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own coach conversations" on coach_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own coach messages" on coach_messages
  for all using (
    exists (
      select 1 from coach_conversations
      where coach_conversations.id = coach_messages.conversation_id
      and coach_conversations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from coach_conversations
      where coach_conversations.id = coach_messages.conversation_id
      and coach_conversations.user_id = auth.uid()
    )
  );
