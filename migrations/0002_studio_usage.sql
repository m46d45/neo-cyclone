-- Anonymous studio usage events (Draw Model / Simulate).
-- No prompt text, no model payload — counts only.
-- visitor is a short hash of the request IP (not the raw IP).

create table if not exists studio_usage (
  id bigserial primary key,
  kind text not null check (kind in ('draw', 'simulate')),
  visitor text not null,
  created_at timestamptz not null default now()
);

create index if not exists studio_usage_kind_idx on studio_usage (kind);
create index if not exists studio_usage_created_idx on studio_usage (created_at);
