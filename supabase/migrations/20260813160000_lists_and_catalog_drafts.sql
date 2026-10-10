-- Sprint: listas (texto/PDF) + rascunhos de catálogo (propostas LLM)

create type list_fonte as enum ('texto', 'pdf');

create table exercise_lists (
  id uuid primary key default gen_random_uuid(),
  titulo text not null default 'Lista sem título',
  fonte list_fonte not null default 'texto',
  raw_text text not null default '',
  storage_path text,
  status exercise_status not null default 'rascunho',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table exercises
  add column list_id uuid references exercise_lists(id) on delete set null,
  add column titulo text,
  add column contexto text,
  add column pergunta text,
  add column area text,
  add column dica text,
  add column rubrica jsonb;

create index exercises_list_id_idx on exercises(list_id);

create type catalog_draft_kind as enum (
  'area',
  'formula',
  'variable',
  'phenomenon',
  'graph'
);

create table catalog_drafts (
  id uuid primary key default gen_random_uuid(),
  kind catalog_draft_kind not null,
  proposed_id text not null,
  payload jsonb not null default '{}',
  source_exercise_id uuid references exercises(id) on delete set null,
  source_list_id uuid references exercise_lists(id) on delete set null,
  status exercise_status not null default 'rascunho',
  confidence float not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index catalog_drafts_status_idx on catalog_drafts(status);
create index catalog_drafts_kind_idx on catalog_drafts(kind);

create table analysis_graphs (
  exercise_id uuid not null references exercises(id) on delete cascade,
  graph_id text not null,
  primary key (exercise_id, graph_id)
);

-- Storage bucket for PDF lists (run in dashboard or via storage API)
-- insert into storage.buckets (id, name, public) values ('listas-pdf', 'listas-pdf', false);

alter table exercise_lists enable row level security;
alter table catalog_drafts enable row level security;
alter table analysis_graphs enable row level security;

create policy "authenticated users manage exercise_lists"
  on exercise_lists for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage catalog_drafts"
  on catalog_drafts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated users manage analysis_graphs"
  on analysis_graphs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create trigger exercise_lists_updated_at
  before update on exercise_lists
  for each row execute function update_updated_at();

create trigger catalog_drafts_updated_at
  before update on catalog_drafts
  for each row execute function update_updated_at();
