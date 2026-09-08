-- Memora Supabase Complete Schema
-- Matches user table specifications and app requirements

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer CHECK (age IS NULL OR (age >= 1 AND age <= 120)),
  preferred_language text NOT NULL DEFAULT 'English'::text,
  location text,
  avatar text,
  caregiver_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT patients_pkey PRIMARY KEY (id)
);

-- 2. Routines Table
CREATE TABLE IF NOT EXISTS public.routines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  label text NOT NULL,
  emoji text,
  description text,
  location text,
  time_of_day time without time zone,
  step_order integer NOT NULL CHECK (step_order >= 1),
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT routines_pkey PRIMARY KEY (id),
  CONSTRAINT routines_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 3. Games Table
CREATE TABLE IF NOT EXISTS public.games (
  id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  description text,
  min_difficulty integer NOT NULL DEFAULT 1 CHECK (min_difficulty >= 1),
  max_difficulty integer NOT NULL DEFAULT 5,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT games_pkey PRIMARY KEY (id)
);

-- 4. Game Sessions Table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  game_id text NOT NULL,
  difficulty integer NOT NULL DEFAULT 1 CHECK (difficulty >= 1),
  score numeric NOT NULL DEFAULT 0 CHECK (score >= 0::numeric),
  accuracy numeric NOT NULL DEFAULT 0 CHECK (accuracy >= 0::numeric AND accuracy <= 100::numeric),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  response_time numeric NOT NULL DEFAULT 0 CHECK (response_time >= 0::numeric),
  hints_used integer NOT NULL DEFAULT 0 CHECK (hints_used >= 0),
  completed boolean NOT NULL DEFAULT false,
  abandoned boolean NOT NULL DEFAULT false,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT game_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT game_sessions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  CONSTRAINT game_sessions_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE
);

-- 5. Game Events Table
CREATE TABLE IF NOT EXISTS public.game_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  game_id text NOT NULL,
  event_type text NOT NULL,
  challenge_id text,
  value jsonb,
  response_time numeric,
  attempt_number integer,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT game_events_pkey PRIMARY KEY (id),
  CONSTRAINT game_events_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  CONSTRAINT game_events_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE,
  CONSTRAINT game_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id) ON DELETE CASCADE
);

-- 6. Cognitive Metrics Table
CREATE TABLE IF NOT EXISTS public.cognitive_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  memory_score numeric CHECK (memory_score IS NULL OR (memory_score >= 0::numeric AND memory_score <= 100::numeric)),
  attention_score numeric CHECK (attention_score IS NULL OR (attention_score >= 0::numeric AND attention_score <= 100::numeric)),
  routine_recall_score numeric CHECK (routine_recall_score IS NULL OR (routine_recall_score >= 0::numeric AND routine_recall_score <= 100::numeric)),
  recognition_score numeric CHECK (recognition_score IS NULL OR (recognition_score >= 0::numeric AND recognition_score <= 100::numeric)),
  average_accuracy numeric CHECK (average_accuracy IS NULL OR (average_accuracy >= 0::numeric AND average_accuracy <= 100::numeric)),
  average_response_time numeric CHECK (average_response_time IS NULL OR average_response_time >= 0::numeric),
  calculated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT cognitive_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT cognitive_metrics_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 7. Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_time time without time zone NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reminders_pkey PRIMARY KEY (id),
  CONSTRAINT reminders_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 8. Caregiver Alerts Table
CREATE TABLE IF NOT EXISTS public.caregiver_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium'::text CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  title text NOT NULL,
  message text NOT NULL,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  acknowledged_at timestamp with time zone,
  CONSTRAINT caregiver_alerts_pkey PRIMARY KEY (id),
  CONSTRAINT caregiver_alerts_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 9. Companion Interactions Table
CREATE TABLE IF NOT EXISTS public.companion_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  type text NOT NULL,
  message text,
  response text,
  language text NOT NULL DEFAULT 'English'::text,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT companion_interactions_pkey PRIMARY KEY (id),
  CONSTRAINT companion_interactions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 10. Routine Results Table
CREATE TABLE IF NOT EXISTS public.routine_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
  game_id text NOT NULL DEFAULT 'routine-ordering'::text,
  score integer DEFAULT 0,
  accuracy integer DEFAULT 0,
  attempts integer DEFAULT 0,
  response_time integer DEFAULT 0,
  difficulty integer DEFAULT 1,
  hints_used integer DEFAULT 0,
  completed boolean DEFAULT false,
  timestamp timestamp with time zone DEFAULT now(),
  challenges jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT routine_results_pkey PRIMARY KEY (id)
);

-- 11. Family Members Table
CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT family_members_pkey PRIMARY KEY (id),
  CONSTRAINT family_members_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- 12. Personalization Questions Table
CREATE TABLE IF NOT EXISTS public.personalization_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  category text NOT NULL CHECK (category IN ('family', 'personal', 'childhood', 'food', 'music', 'hobbies', 'places', 'home')),
  question text NOT NULL,
  answer text NOT NULL,
  options jsonb DEFAULT '[]'::jsonb,
  format text NOT NULL CHECK (format IN ('multiple-choice', 'voice', 'image', 'fill-blank')),
  image text,
  audio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT personalization_questions_pkey PRIMARY KEY (id),
  CONSTRAINT personalization_questions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- Enable RLS Policies (Allow Read/Write for prototype)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on routines" ON public.routines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on games" ON public.games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on game_sessions" ON public.game_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on game_events" ON public.game_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on cognitive_metrics" ON public.cognitive_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on caregiver_alerts" ON public.caregiver_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on companion_interactions" ON public.companion_interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on routine_results" ON public.routine_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on family_members" ON public.family_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on personalization_questions" ON public.personalization_questions FOR ALL USING (true) WITH CHECK (true);
