-- 启用 UUID 扩展
create extension if not exists "pgcrypto";

create table if not exists pets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  species     text not null check (species in ('cat', 'dog', 'other')),
  breed       text,
  birthday    date,
  gender      text default 'unknown' check (gender in ('male', 'female', 'unknown')),
  avatar_url  text,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 每个用户只能访问自己的宠物（Row Level Security）
alter table pets enable row level security;

create policy "users can manage own pets"
  on pets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自动更新 updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pets_updated_at
  before update on pets
  for each row execute function update_updated_at();
