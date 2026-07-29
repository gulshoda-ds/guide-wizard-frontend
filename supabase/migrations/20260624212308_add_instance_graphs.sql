
-- Instance graphs table
create table if not exists public.instance_graphs (
  id uuid primary key default gen_random_uuid(),
  schema_version text not null default 'v4',
  graph jsonb not null,
  stage1_prompt text,
  stage2_message text,
  grounded_node_values text[],
  created_at timestamptz not null default now()
);

alter table public.instance_graphs enable row level security;

create policy "insert_instance_graphs" on public.instance_graphs
  for insert to anon with check (true);

create policy "select_instance_graphs" on public.instance_graphs
  for select to anon using (true);

create index if not exists instance_graphs_created_idx
  on public.instance_graphs (created_at desc);
