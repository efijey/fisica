-- Sprint 3: schema do alimentador de exercícios

create type exercise_status as enum (
  'rascunho',
  'aprovado',
  'rejeitado',
  'publicado'
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  enunciado text not null,
  fonte text,
  status exercise_status not null default 'rascunho',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table exercise_analyses (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  confidence float not null default 0,
  resolver_method text not null default 'regras',
  raw_extraction jsonb not null default '{}',
  computed_answer float,
  computed_unit text,
  created_at timestamptz not null default now(),
  unique (exercise_id)
);

create table exercise_values (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  variable_id text not null,
  value float not null,
  unit text,
  role text not null check (role in ('dado', 'incognita'))
);

create table analysis_formulas (
  exercise_id uuid not null references exercises(id) on delete cascade,
  formula_id text not null,
  primary key (exercise_id, formula_id)
);

create table analysis_variables (
  exercise_id uuid not null references exercises(id) on delete cascade,
  variable_id text not null,
  primary key (exercise_id, variable_id)
);

create table analysis_phenomena (
  exercise_id uuid not null references exercises(id) on delete cascade,
  phenomenon_id text not null,
  primary key (exercise_id, phenomenon_id)
);

create table analysis_entities (
  exercise_id uuid not null references exercises(id) on delete cascade,
  entity text not null,
  primary key (exercise_id, entity)
);

create index exercises_status_idx on exercises(status);
create index exercises_created_at_idx on exercises(created_at desc);

alter table exercises enable row level security;
alter table exercise_analyses enable row level security;
alter table exercise_values enable row level security;
alter table analysis_formulas enable row level security;
alter table analysis_variables enable row level security;
alter table analysis_phenomena enable row level security;
alter table analysis_entities enable row level security;

create policy "authenticated users manage exercises"
  on exercises for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage exercise_analyses"
  on exercise_analyses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage exercise_values"
  on exercise_values for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage analysis_formulas"
  on analysis_formulas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage analysis_variables"
  on analysis_variables for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage analysis_phenomena"
  on analysis_phenomena for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage analysis_entities"
  on analysis_entities for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger exercises_updated_at
  before update on exercises
  for each row execute function update_updated_at();
