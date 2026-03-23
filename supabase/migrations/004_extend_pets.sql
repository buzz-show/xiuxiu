-- 给 pets 表新增三列：绝育情况、体重、到家日期
alter table pets
  add column if not exists sterilized boolean not null default false,
  add column if not exists weight    numeric(5, 2),
  add column if not exists home_date date;
