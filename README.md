# Smarika — Dementia care companion

## Supabase setup

1. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
   Supabase → **Project Settings → API → anon public**.
2. In the Supabase SQL Editor, run `supabase/seed.sql` (creates optional `caregivers`
   table, seeds two patients under one caregiver, sample routines / family /
   personalization questions, and open RLS policies for demo).
3. Restart `npm run dev`.

## How data flows

| Caregiver dashboard | Supabase table | Consumed by |
|---------------------|----------------|-------------|
| Profile → Daily routine | `routines` | Routine Ordering + Routine World |
| Profile → Family members | `family_members` | Family Tree (fixed positions by relationship) |
| Profile → Personalization Qs | `personalization_questions` | Memory Map |
| Memories | `diary_entries` | Memories page |
| Reminders | `reminders` | Reminders + overview |
| Progress / overview | `cognitive_metrics`, `game_sessions`, `caregiver_alerts` | Charts & activity |
| Games catalog | `games` | Games page toggles |

### RBAC / patient switcher

- Caregivers are linked via `patients.caregiver_id` (and optional `caregivers` table).
- Header dropdown lists all patients for the logged-in caregiver.
- Switching patient reloads every dashboard query scoped to that `patient_id`.
