create table if not exists health_records (
  id             uuid primary key default gen_random_uuid(),
  pet_id         uuid not null references pets(id) on delete cascade,
  date           date not null,
  type           text not null check (type in ('vaccine', 'deworming', 'checkup', 'illness', 'other')),
  title          text not null,
  note           text,
  next_due_date  date,
  created_at     timestamptz default now()
);

alter table health_records enable row level security;

-- 通过 pets 表关联验证归属权
create policy "users can manage own health records"
  on health_records for all
  using (
    exists (
      select 1 from pets
      where pets.id = health_records.pet_id
        and pets.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from pets
      where pets.id = health_records.pet_id
        and pets.user_id = auth.uid()
    )
  );

create index on health_records(pet_id, date desc);
