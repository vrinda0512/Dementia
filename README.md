hi, just a basic main file

Supabase integration
--------------------

This project can optionally use Supabase to store user routines and game results. To enable:

1. Copy `.env.example` to `.env.local` and fill in your Supabase project values.

2. Create the following tables in your Supabase project (example SQL):

```sql
create table routines (
	id text primary key,
	patient_id text,
	label text,
	emoji text,
	location text,
	description text,
	"order" int
);

create table routine_results (
	id uuid primary key default gen_random_uuid(),
	patient_id text,
	game_id text,
	score int,
	accuracy int,
	attempts int,
	response_time int,
	difficulty int,
	hints_used int,
	completed boolean,
	timestamp timestamptz,
	challenges jsonb
);
```

3. Restart the dev server (`npm run dev`). When Supabase is configured the app will fetch routines and persist results; otherwise it falls back to bundled demo data.
