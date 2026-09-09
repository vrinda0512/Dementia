-- Smarika / Dementia care schema helpers + seed
-- Run in Supabase SQL Editor. Adjust if columns already exist.
-- Project tables expected: patients, caregivers (optional), family_members,
-- routines, personalization_questions, reminders, cognitive_metrics,
-- caregiver_alerts, diary_entries, games, game_sessions, routine_results.

-- Optional caregivers table (RBAC). Safe to skip if you only use patients.caregiver_id.
create table if not exists public.caregivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text default 'caregiver',
  created_at timestamptz default now()
);

-- Ensure patients has caregiver_id for multi-patient dropdown
alter table public.patients
  add column if not exists caregiver_id uuid;

alter table public.patients
  add column if not exists preferred_language text;

alter table public.patients
  add column if not exists location text;

alter table public.patients
  add column if not exists avatar text;

alter table public.patients
  add column if not exists age int;

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  relationship text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table public.family_members
  add column if not exists photo_url text;

alter table public.family_members
  add column if not exists created_at timestamptz not null default now();

-- Seed caregiver + two patients (ids match app DEFAULT_* constants)
insert into public.caregivers (id, name, email, role)
values (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Dr. Ananya Sharma',
  'ananya@smarika.care',
  'caregiver'
)
on conflict (id) do update set name = excluded.name, email = excluded.email;

insert into public.patients (id, name, age, preferred_language, location, caregiver_id)
values
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Meena Sharma',
    72,
    'Hindi',
    'Shillong',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Rajesh Kumar',
    68,
    'English',
    'Guwahati',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  )
on conflict (id) do update
  set caregiver_id = excluded.caregiver_id,
      name = excluded.name;

-- Sample routine for Meena (feeds routine-ordering + routine-world)
insert into public.routines (patient_id, label, emoji, description, location, time_of_day, step_order, active)
select 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', v.label, v.emoji, v.description, v.location, v.time_of_day, v.step_order, true
from (values
  ('Wake Up', '🌅', 'Begin the morning gently', 'Bedroom', '07:00:00', 1),
  ('Brush Teeth', '🪥', 'Freshen up', 'Bathroom', '07:15:00', 2),
  ('Have Tea', '🍵', 'Morning tea', 'Kitchen', '07:30:00', 3),
  ('Take Medicine', '💊', 'Morning medicines', 'Medicine Shelf', '07:45:00', 4),
  ('Breakfast', '🍽️', 'Eat breakfast', 'Dining', '08:00:00', 5)
) as v(label, emoji, description, location, time_of_day, step_order)
where not exists (
  select 1 from public.routines r
  where r.patient_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Sample family for family-tree (positions are fixed by relationship in the app)
insert into public.family_members (patient_id, name, relationship, photo_url)
select 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', v.name, v.relationship, null
from (values
  ('Kamala Devi', 'grandmother'),
  ('Hari Sharma', 'grandfather'),
  ('Sunita Sharma', 'mother'),
  ('Rajesh Sharma', 'father'),
  ('Priya', 'sister'),
  ('Meena', 'me'),
  ('Aarav', 'brother')
) as v(name, relationship)
where not exists (
  select 1 from public.family_members f
  where f.patient_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Sample personalization questions for memory-map
insert into public.personalization_questions (patient_id, category, question, answer, options, format)
select 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', v.category, v.question, v.answer, v.options::jsonb, v.format
from (values
  ('family', 'What is your daughter''s name?', 'Priya', '["Priya","Ananya","Sunita","Ritu"]', 'multiple-choice'),
  ('food', 'What is your favourite morning drink?', 'Tea', '["Tea","Coffee","Milk","Juice"]', 'multiple-choice'),
  ('home', 'Which city do you live near?', 'Shillong', '["Shillong","Delhi","Mumbai","Chennai"]', 'multiple-choice')
) as v(category, question, answer, options, format)
where not exists (
  select 1 from public.personalization_questions q
  where q.patient_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Games catalog
insert into public.games (id, name, type, description, min_difficulty, max_difficulty, active)
values
  ('routine-ordering', 'Routine Recall', 'routine', 'Arrange daily activities in the correct order.', 1, 5, true),
  ('memory-map', 'Memory Map', 'spatial', 'Explore personal memory questions by category.', 1, 5, true),
  ('family-tree', 'Family Tree', 'recognition', 'Match family photos on the tree.', 1, 3, true),
  ('therapeutic-tea-room-2-AG', 'Quiet Tea Room', 'therapeutic', 'Calming tea-making experience.', 1, 3, true),
  ('journal-diary', 'My Journal', 'expression', 'Guided journaling for expression.', 1, 3, true)
on conflict (id) do nothing;

-- Helpful indexes
create index if not exists idx_patients_caregiver on public.patients (caregiver_id);
create index if not exists idx_routines_patient on public.routines (patient_id, step_order);
create index if not exists idx_family_patient on public.family_members (patient_id);
create index if not exists idx_questions_patient on public.personalization_questions (patient_id);
create index if not exists idx_sessions_patient on public.game_sessions (patient_id);

-- Dev-friendly: allow anon key CRUD (tighten with Auth + RLS for production)
alter table public.patients enable row level security;
alter table public.family_members enable row level security;
alter table public.routines enable row level security;
alter table public.personalization_questions enable row level security;
alter table public.reminders enable row level security;
alter table public.diary_entries enable row level security;
alter table public.game_sessions enable row level security;
alter table public.games enable row level security;
alter table public.cognitive_metrics enable row level security;
alter table public.caregiver_alerts enable row level security;
alter table public.routine_results enable row level security;

-- Open policies for college demo (replace with auth.uid() policies later)
do $$
declare
  t text;
begin
  foreach t in array array[
    'patients','family_members','routines','personalization_questions',
    'reminders','diary_entries','game_sessions','games','cognitive_metrics',
    'caregiver_alerts','routine_results','caregivers'
  ]
  loop
    execute format('drop policy if exists "anon_all_%s" on public.%I', t, t);
    begin
      execute format(
        'create policy "anon_all_%s" on public.%I for all using (true) with check (true)',
        t, t
      );
    exception when undefined_table then
      null;
    end;
  end loop;
end $$;
